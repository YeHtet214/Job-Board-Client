// Type definitions
export interface SavedJobWithDetails {
    id: string
    createdAt: string
    job: {
        id: string
        title: string
        location?: string
        company?: {
            id: string
            name: string
            logo?: string
        }
    }
}

export interface JobSavedStatus {
    isSaved: boolean
    savedJobId: string | null
}

export interface SaveJobResponse {
    id: string
    jobId: string
    userId: string
    createdAt: string
}
