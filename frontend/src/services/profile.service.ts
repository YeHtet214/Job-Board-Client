import { ApiService } from '@/services/api.service';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@/types/profile';
import { profile } from 'console';

class ProfileService extends ApiService {
  private endpoints = {
    ALL: '/profiles',
    MY_PROFILE: '/profiles/me',
    DETAIL: (id: string) => `/profiles/${id}`,
    UPLOAD_RESUME: '/profiles/upload-resume',
    UPLOAD_PROFILE_IMAGE: '/profiles/upload-profile-image'
  };

  public async getMyProfile(): Promise<Profile> {
    const response = await this.get<Profile>(this.endpoints.MY_PROFILE);
    console.log("get profile data: ", response)
    return response.data.data;
  }

  public async getProfileById(id: string): Promise<Profile> {
    const response = await this.get<Profile>(this.endpoints.DETAIL(id));
    return response.data.data;
  }

  public async createProfile(profileData: CreateProfileDto): Promise<Profile> {
    const formData = new FormData();

    console.log("Profile data form in service raw: ", profileData); 
    for (const [key, value] of Object.entries(profileData)) {
      formData.append(key, value);
    }

    console.log("Profile data form in service: ", formData);
    console.log(formData.getAll('experience'));
    console.log(formData.getAll('education'));
    console.log(formData.getAll('skills'));

    const response = await this.post<Profile>(this.endpoints.MY_PROFILE, formData);
    return response.data.data;
  }

  public async updateProfile(profileData: UpdateProfileDto): Promise<Profile> {
    const formData = new FormData();

    for (const [key, value] of Object.entries(profileData)) {
      formData.append(key, value as string);
    }
    const response = await this.put<Profile>(this.endpoints.MY_PROFILE, formData);
    return response.data.data;
  }

  public async uploadResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('resume', file);
    
    // Set the content type to undefined to let the browser set the correct multipart boundary
    const response = await this.post<{ url: string }>(this.endpoints.UPLOAD_RESUME, formData);
    
    return response.data.data.url;
  }

  public async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await this.post<{ url: string }>(this.endpoints.UPLOAD_PROFILE_IMAGE, formData);
    
    return response.data.data.url;
  }
}

export const profileService = new ProfileService();
