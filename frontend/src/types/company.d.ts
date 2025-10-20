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
