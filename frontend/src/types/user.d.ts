import { Profile } from './profile'

export type UserRole = 'JOBSEEKER' | 'EMPLOYER' | 'ADMIN'

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    createdAt?: string
    updatedAt?: string
    profile?: Profile
    profileImageURL?: string // for conversatoin receiver avatar
    logo?: string // for conversation receiver avatar
}
