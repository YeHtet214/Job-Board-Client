export interface Company {
    id: string
    name: string
    description: string
    website?: string
    logo?: string
    location: string
    industry: string
    foundedYear?: number
    size?: string
    userId: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

export interface CreateCompanyDto {
    name: string
    description: string
    website?: string
    logo?: string
    location: string
    industry: string
    foundedYear?: number
    size?: string
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

export enum CompanySize {
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "500+"
}