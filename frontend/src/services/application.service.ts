import { ApiService } from './api.service'
import {
   Application,
   CreateApplicationDto,
   UpdateApplicationDto,
} from '../types/application'

class ApplicationService extends ApiService {
   private endpoints = {
      ALL: '/applications',
      DETAIL: (id: string) => `/applications/${id}`,
      MY_APPLICATIONS: (userId: string) => `/applications/users/${userId}`,
      APPLY_JOB: (jobId: string) => `/applications/jobs/${jobId}`,
      APPLICATIONS_BY_JOB_ID: (jobId: string) => `/jobs/${jobId}/applications`,
   }

   public async getMyApplications(userId: string): Promise<Application[]> {
      const response = await this.get<Application[]>(
         this.endpoints.MY_APPLICATIONS(userId)
      )
      return response.data.data
   }

   public async getApplicationById(id: string): Promise<Application> {
      const response = await this.get<Application>(this.endpoints.DETAIL(id))
      return response.data.data
   }

   public async getApplicationsByJobId(jobId: string): Promise<Application[]> {
      const response = await this.get<Application[]>(
         this.endpoints.APPLICATIONS_BY_JOB_ID(jobId)
      )

      console.log('Applications by job id: ', response.data.data)
      return response.data.data
   }

   public async createApplication(
      applicationData: CreateApplicationDto
   ): Promise<Application> {
      const formData = new FormData()

      for (const [key, value] of Object.entries(applicationData)) {
         formData.append(key, value)
      }

      const response = await this.post<Application>(
         this.endpoints.APPLY_JOB(applicationData.jobId),
         formData
      )
      return response.data.data
   }

   public async updateApplication(
      id: string,
      updateData: UpdateApplicationDto
   ): Promise<Application> {
      const response = await this.put<Application>(
         this.endpoints.DETAIL(id),
         updateData
      )
      return response.data.data
   }

   public async withdrawApplication(id: string): Promise<void> {
      await this.delete<void>(this.endpoints.DETAIL(id))
   }
}

export default new ApplicationService()
