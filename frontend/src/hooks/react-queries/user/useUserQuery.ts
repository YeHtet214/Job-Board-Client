import authService from '@/services/auth.service'
import userService from '@/services/user.service'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

const userKeys = {
    currentUser: () => ['current-user'],
}

// Current User Query
export const useCurrentUser = () => {
    return useQuery<User | null>({
        queryKey: userKeys.currentUser(),
        queryFn: async () => {
            try {
                // Only attempt to fetch if we have a token
                const isAuthenticated = authService.isAuthenticated()

                if (!isAuthenticated) {
                    return null
                }

                const user = await userService.getCurrentUser()
                return user
            } catch (error) {
                console.error('Error fetching current user:', error)
                // If there's an error that's not a 401, we should still return null
                // The 401 errors are handled by the axios interceptors
                return null
            }
        },
        retry: 1, // Allow one retry in case of network issues
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
    })
}
