import { AppliedJobInfo } from "./job"
import { Applicant, User } from "./user"

export type ApplicationStatus =
    | 'PENDING'
    | 'REVIEWING'
    | 'INTERVIEW'
    | 'REJECTED'
    | 'ACCEPTED'

export interface Application {
    id: string
    jobId: string
    applicantId: string
    coverLetter?: string
    resumeURL?: string
    acceptTerms: boolean
    additionalInfo?: string
    status: ApplicationStatus
    createdAt: string
    updatedAt: string
    job?: AppliedJobInfo // The job details will be populated when needed
    applicant?: Applicant // The applicant details will be populated when needed
}

export interface CreateApplicationDto {
    jobId: string
    // Personal info
    fullName: string
    email: string
    phone: string

    // Resume
    resume?: File | null
    resumeURL?: string
    useExistingResume: boolean

    // Cover letter
    coverLetter: string

    // Additional questions
    availability: string
    expectedSalary: string
    additionalInfo: string

    // Terms
    acceptTerms: boolean
}

export interface UpdateApplicationDto extends Partial<Application> {
    status: ApplicationStatus
}
