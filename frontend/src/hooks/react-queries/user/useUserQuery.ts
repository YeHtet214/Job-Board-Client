import userService from '@/services/user.service'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

const userKeys = {
   currentUser: () => ['current-user'],
}

// Current User Query
export const useCurrentUser = () => {
   const accessToken = localStorage.getItem('accessToken')

   return useQuery<User | null>({
      queryKey: userKeys.currentUser(),
      queryFn: () => userService.getCurrentUser(),
      enabled: !!accessToken, // Only fetch when access token exists
      retry: false, // Don't retry on failure to avoid multiple error messages
   })
}
