import { Dispatch, SetStateAction } from 'react'

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT'

export interface Job {
   id: string
   title: string
   description: string
   companyId: string
   postedById: string
   location: string
   type: JobType
   salaryMin: number
   salaryMax: number
   requiredSkills: string[]
   experienceLevel: string
   expiresAt?: string
   isActive: boolean
   createdAt: string
   updatedAt: string
   company?: {
      name: string
      logo?: string
      industry?: string
   }
   postedBy?: {
      firstName: string
      lastName: string
      email: string
   }
}

export interface JobsResponse {
   jobs: Job[]
   meta: {
      totalPages: number
      totalCount: number
      currentPage: number
   }
}

export interface CreateJobDto {
   title: string
   description: string
   location: string
   type: JobType
   salaryMin: number
   salaryMax: number
   requiredSkills: string[]
   experienceLevel: string
   expiresAt?: string
}

export interface UpdateJobDto extends Partial<CreateJobDto> {
   isActive?: boolean
}

export interface JobFilterType {
   keyword: string
   location: string
   jobTypes: string[]
   experienceLevel: string
   page?: number
   limit?: number
   sortBy?: SortOption
}

export interface JobFilterProps extends JobFilterType {
   setKeyword?: Dispatch<SetStateAction<string>>
   setLocation?: Dispatch<SetStateAction<string>>
   setJobTypes?: Dispatch<SetStateAction<string[]>>
   setExperienceLevel?: Dispatch<SetStateAction<string>>
}
