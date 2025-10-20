import axios from 'axios'
import { isTokenExpired, willTokenExpireSoon } from '../utils/jwt'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
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
        const refreshToken = localStorage.getItem('refreshToken')

        // Skip auth header for auth endpoints except logout
        const isAuthEndpoint =
            config.url?.includes('/auth/') &&
            !config.url?.includes('/auth/logout')

        if (accessToken && !isAuthEndpoint) {
            if (willTokenExpireSoon(accessToken, 120)) {
                // expire in 2 minutes
                try {
                    // Only start a refresh if another request isn't already refreshing
                    if (
                        !isRefreshing &&
                        refreshToken &&
                        !isTokenExpired(refreshToken)
                    ) {
                        isRefreshing = true

                        // Make refresh request directly without going through interceptors
                        const response = await axios.post(
                            `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
                            {
                                refreshToken,
                            }
                        )

                        const {
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        } = response.data.data

                        localStorage.setItem('accessToken', newAccessToken)
                        localStorage.setItem('refreshToken', newRefreshToken)

                        // Update the current request with new token
                        config.headers.Authorization = `Bearer ${newAccessToken}`

                        // Notify all waiting requests
                        onTokenRefreshed(newAccessToken)
                        isRefreshing = false
                    } else if (isRefreshing) {
                        // If we're already refreshing, wait for the new token
                        const newToken = await new Promise<string>(
                            (resolve) => {
                                subscribeTokenRefresh((token) => resolve(token))
                            }
                        )

                        // Apply new token to this request
                        config.headers.Authorization = `Bearer ${newToken}`
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error)
                    // If refresh fails, clear tokens and let the response interceptor handle the error
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
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Extract error message if available
        if (error.response?.data?.message) {
            error.message = error.response.data.message
        }

        // Don't trigger session expired events for auth endpoints (login, register, etc.)
        const isAuthEndpoint =
            originalRequest.url?.includes('/auth/') &&
            !originalRequest.url?.includes('/auth/refresh-token') &&
            !originalRequest.url?.includes('/auth/logout')

        // Handle 401 Unauthorized errors (but not for login/register attempts)
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true

            const refreshToken = localStorage.getItem('refreshToken')

            // Only try to refresh if we have a refresh token and aren't already refreshing
            if (
                refreshToken &&
                !isRefreshing &&
                !isTokenExpired(refreshToken)
            ) {
                try {
                    isRefreshing = true

                    // Refresh token
                    const response = await axios.post(
                        `${axiosInstance.defaults.baseURL}/auth/refresh-token`,
                        {
                            refreshToken,
                        }
                    )

                    const {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    } = response.data.data

                    localStorage.setItem('accessToken', newAccessToken)
                    localStorage.setItem('refreshToken', newRefreshToken)

                    console.log(
                        'Access Token: ',
                        newAccessToken,
                        'Refresh Token: ',
                        newRefreshToken
                    )

                    // Update the original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                    // Notify waiting requests
                    onTokenRefreshed(newAccessToken)
                    isRefreshing = false

                    // Retry the original request
                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    isRefreshing = false

                    // Clear auth tokens on refresh failure
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')

                    // Dispatch session expired event
                    window.dispatchEvent(new CustomEvent('auth:sessionExpired'))

                    return Promise.reject(refreshError)
                }
            } else if (isRefreshing) {
                // If already refreshing, wait for new token
                try {
                    const newToken = await new Promise<string>((resolve) => {
                        subscribeTokenRefresh((token) => resolve(token))
                    })

                    console.log('New token: ', newToken)

                    // Update request and retry
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return axiosInstance(originalRequest)
                } catch (waitError) {
                    return Promise.reject(waitError)
                }
            } else {
                // If refresh token is expired or not available
                console.log('Just to remove refresh Token: ', refreshToken)
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                // Only dispatch session expired if we're not handling an auth endpoint
                if (!isAuthEndpoint) {
                    // Dispatch session expired event
                    window.dispatchEvent(new CustomEvent('auth:sessionExpired'))
                }
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
