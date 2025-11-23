import { ApiService } from './api.service'
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company'
import { CompanySearchParams } from '@/pages/company/CompaniesPage'

class CompanyService extends ApiService {
   private endpoints = {
      ALL: '/companies',
      DETAIL: (id: string) => `/companies/${id}`,
      MY_COMPANY: '/companies/my-company',
   }

   public async getAllCompanies(params: Partial<CompanySearchParams>) {
      const queryParams = new URLSearchParams()

      Object.entries(params).forEach(([key, value]) => {
         if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString())
         }
      })

      const response = await this.get<Company[]>(
         `${this.endpoints.ALL}?${queryParams.toString()}`
      )

      if (!response.data.success) {
         throw new Error('Failed to fetch companies')
      }

      return {
         companies: response.data.data,
         meta: {
            currentPage: response.data.meta?.currentPage,
            total: response.data.meta?.totalCount,
            totalPages: response.data.meta?.totalPages,
         },
      }
   }

   public async getCompanyById(id: string): Promise<Company> {
      const response = await this.get<Company>(this.endpoints.DETAIL(id))
      return response.data.data
   }

   public async getMyCompany(): Promise<Company> {
      const response = await this.get<Company>(this.endpoints.MY_COMPANY)
      return response.data.data
   }

   public async createCompany(companyData: CreateCompanyDto): Promise<Company> {
      const response = await this.post<Company>(this.endpoints.ALL, companyData)
      return response.data.data
   }

   public async updateCompany(
      id: string,
      companyData: UpdateCompanyDto
   ): Promise<Company> {
      const response = await this.put<Company>(
         this.endpoints.DETAIL(id),
         companyData
      )
      return response.data.data
   }

   public async deleteCompany(id: string): Promise<void> {
      await this.delete<void>(this.endpoints.DETAIL(id))
   }
}

export default new CompanyService()
