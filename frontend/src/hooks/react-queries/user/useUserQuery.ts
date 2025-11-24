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
      queryFn: () => userService.getCurrentUser(),
   })
}
