/**
 * JWT utility functions for token handling
 */

interface DecodedToken {
   exp: number
   iat: number
   sub: string
   role: string
   [key: string]: any
}

/**
 * Decodes a JWT token
 * @param token JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
export const decodeToken = (token: string): DecodedToken | null => {
   try {
      // JWT structure: header.payload.signature
      const base64Url = token.split('.')[1]
      if (!base64Url) return null

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
         atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
      )

      return JSON.parse(jsonPayload)
   } catch (error) {
      console.error('Error decoding token:', error)
      return null
   }
}

export const isTokenExpired = (token: string | null): boolean => {
   if (!token) return true

   const decodedToken = decodeToken(token)
   if (!decodedToken) return true

   const currentTime = Math.floor(Date.now() / 1000)
   return decodedToken.exp < currentTime
}

/**
 * Checks if a token will expire within the given buffer time
 * @param token JWT token to check
 * @param bufferSeconds Time buffer in seconds (default: 60 seconds)
 * @returns True if token will expire soon, false otherwise
 */
export const willTokenExpireSoon = (
   token: string | null,
   bufferSeconds: number = 60
): boolean => {
   if (!token) return true

   const decodedToken = decodeToken(token)
   if (!decodedToken) return true

   const currentTime = Math.floor(Date.now() / 1000)
   return decodedToken.exp < currentTime + bufferSeconds
}
