import axios from 'axios'
import { isTokenExpired, willTokenExpireSoon } from '../utils/jwt'

const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
})

// Whether we're currently refreshing the token
let isRefreshing = false
// Queued requests waiting for token refresh
let refreshSubscribers: Array<(token: string) => void> = []

// Function to add callbacks to the subscriber queue
const subscribeTokenRefresh = (callback: (token: string) => void) => {
   refreshSubscribers.push(callback)
}

// Function to notify subscribers about new token
const onTokenRefreshed = (newToken: string) => {
   refreshSubscribers.forEach((callback) => callback(newToken))
   refreshSubscribers = []
}

// Request interceptor to add auth token and handle expiring tokens
axiosInstance.interceptors.request.use(
   async (config) => {
      const accessToken = localStorage.getItem('accessToken')

      // Skip auth header for auth endpoints except logout
      const isAuthEndpoint = config.url?.includes('/auth/') && !config.url?.includes('/auth/logout')

      if (accessToken && !isAuthEndpoint) {
         if (willTokenExpireSoon(accessToken, 120)) {
            // expire in 2 minutes
            try {
               // Only start a refresh if another request isn't already refreshing
               if (!isRefreshing) {
                  isRefreshing = true

                  // Make refresh request directly without going through interceptors
                  const response = await axiosInstance.post('/auth/refresh-token')

                  const { accessToken: newAccessToken } = response.data.data

                  localStorage.setItem('accessToken', newAccessToken)

                  config.headers.Authorization = `Bearer ${newAccessToken}`
                  onTokenRefreshed(newAccessToken)
                  isRefreshing = false
               } else if (isRefreshing) {
                  const newToken = await new Promise<string>((resolve) => {
                     subscribeTokenRefresh((token) => resolve(token))
                  })
                  config.headers.Authorization = `Bearer ${newToken}`
               }
            } catch (error) {
               console.error('Error refreshing token:', error)
            }
         } else {
            // Token is still valid, use it
            config.headers.Authorization = `Bearer ${accessToken}`
         }
      }

      return config
   },
   (error) => {
      return Promise.reject(error)
   }
)

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config

      // Extract error message if available
      if (error.response?.data?.message) {
         error.message = error.response.data.message
      }

      // Don't trigger session expired events for auth endpoints (login, register, etc.)
      //   const isAuthEndpoint =
      //      originalRequest.url?.includes('/auth/') &&
      //      !originalRequest.url?.includes('/auth/refresh-token') &&
      //      !originalRequest.url?.includes('/auth/logout')

      // Handle 401 Unauthorized errors (but not for login/register attempts)
      if (error.response.status === 401 && !originalRequest._retry) {
         if (isRefreshing) {
            try {
               const newToken = await new Promise<string>((resolve) => {
                  subscribeTokenRefresh((token) => resolve(token))
               })

               // Update request and retry
               originalRequest.headers.Authorization = `Bearer ${newToken}`
               return axiosInstance(originalRequest)
            } catch (waitError) {
               return Promise.reject(waitError)
            }
         }

         try {
            originalRequest._retry = true
            isRefreshing = true

            return new Promise((resolve, reject) => {
               axiosInstance
                  .post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`)
                  .then((response) => {
                     console.log('refresh response: ', response.data)
                     const { accessToken: newAccessToken } = response.data.data
                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                     onTokenRefreshed(newAccessToken)
                     resolve(axiosInstance(originalRequest))
                  })
                  .catch((error) => {
                     reject(error)
                  })
                  .finally(() => {
                     isRefreshing = false
                  })
            })
         } catch (refreshError) {
            isRefreshing = false

            localStorage.removeItem('accessToken')
            window.dispatchEvent(new CustomEvent('auth:sessionExpired'))

            return Promise.reject(refreshError)
         }
      }

      return Promise.reject(error)
   }
)

export default axiosInstance
