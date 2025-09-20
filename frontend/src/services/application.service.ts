import { ApiService } from './api.service';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '../types/application';

class ApplicationService extends ApiService {
  private endpoints = {
    ALL: '/applications',
    DETAIL: (id: string) => `/applications/${id}`,
    MY_APPLICATIONS: (userId: string) => `/applications/users/${userId}`,
    JOB_APPLICATIONS: (jobId: string) => `/applications/jobs/${jobId}`
  };

  public async getMyApplications(userId: string): Promise<Application[]> {
    const response = await this.get<Application[]>(this.endpoints.MY_APPLICATIONS(userId));
    return response.data.data;
  }

  public async getApplicationById(id: string): Promise<Application> {
    const response = await this.get<Application>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    const response = await this.get<Application[]>(this.endpoints.JOB_APPLICATIONS(jobId));
    return response.data.data;
  }

  public async createApplication(applicationData: CreateApplicationDto): Promise<Application> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(applicationData)) {
      formData.append(key, value);
    }

    console.log(formData.getAll('resume'));

    const response = await this.post<Application>(this.endpoints.JOB_APPLICATIONS(applicationData.jobId), formData);
    return response.data.data;
  }

  public async updateApplication(id: string, updateData: UpdateApplicationDto): Promise<Application> {
    const response = await this.put<Application>(this.endpoints.DETAIL(id), updateData);
    return response.data.data;
  }

  public async withdrawApplication(id: string): Promise<void> {
    await this.delete<void>(this.endpoints.DETAIL(id));
  }
}

export default new ApplicationService();
