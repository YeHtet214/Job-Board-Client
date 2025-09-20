// Job seeker types
export interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  applied: string; // ISO date string
  logo?: string;
  jobId: string;
}

export interface RecentActivity {
  id: string;
  type: 'VIEW' | 'APPLY' | 'SAVE' | 'MESSAGE';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
  entityId?: string;
}

export interface JobSeekerStats {
  totalApplications: number;
  interviews: number;
  offers: number;
  savedJobs: number;
  profileCompletion: number;
}

export interface JobSeekerDashboardData {
  stats: JobSeekerStats;
  applications: JobApplication[];
  recentActivity: RecentActivity[];
}

// Employer types
export interface PostedJob {
  id: string;
  title: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  applicationsCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  postedDate: string; // ISO date string
  expiresAt: string; // ISO date string
}

export interface ReceivedApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantId: string;
  status: 'PENDING' | 'REVIEWING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED';
  applied: string;
  applicantEmail?: string;
  applicantPhone?: string;
  resumeUrl?: string;
}

export interface EmployerActivity {
  id: string;
  type: 'NEW_APPLICATION' | 'APPLICATION_VIEWED' | 'JOB_POSTED' | 'JOB_EXPIRED' | 'INTERVIEW_SCHEDULED';
  title: string;
  timestamp: string; // ISO date string
  relatedEntity: string;
  entityId?: string;
}

export interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  reviewingApplications: number;
  interviewInvitations: number;
}

export interface EmployerDashboardData {
  stats: EmployerStats;
  jobs: PostedJob[];
  applications: ReceivedApplication[];
  recentActivity: EmployerActivity[];
  company: boolean;
  companyProfilePercentage: number;
}

// DTO types for API operations
export interface UpdateApplicationStatusDto {
  status: ReceivedApplication['status'];
}
