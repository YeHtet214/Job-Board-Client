import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useCompanies as useCompaniesQuery } from '@/hooks/react-queries/company/useCompanyQueries'
import { Company } from '@/types/company'

interface CompaniesContextType {
    companies: Company[]
    filteredCompanies: Company[]
    isLoading: boolean
    error: Error | null
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedIndustries: string[]
    setSelectedIndustries: React.Dispatch<React.SetStateAction<string[]>>
    selectedSizes: string[]
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>
    refetchCompanies: () => void
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(
    undefined
)

export const useCompanies = () => {
    const context = useContext(CompaniesContext)
    if (context === undefined) {
        throw new Error('useCompanies must be used within a CompaniesProvider')
    }
    return context
}

interface CompaniesProviderProps {
    children: ReactNode
}

export const CompaniesProvider: React.FC<CompaniesProviderProps> = ({
    children,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])

    // Fetch companies using the custom hook
    const {
        data: companies = [],
        isLoading,
        error,
        refetch: refetchCompanies,
    } = useCompaniesQuery()

    // Apply filters to companies
    const filteredCompanies = React.useMemo(() => {
        let result = companies

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (company) =>
                    company.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    company.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    company.location
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        }

        // Apply industry filter
        if (selectedIndustries.length > 0) {
            result = result.filter((company) =>
                selectedIndustries.includes(company.industry)
            )
        }

        // Apply size filter
        if (selectedSizes.length > 0) {
            result = result.filter((company) =>
                company.size ? selectedSizes.includes(company.size) : false
            )
        }

        return result
    }, [companies, searchTerm, selectedIndustries, selectedSizes])

    const value = {
        companies,
        filteredCompanies,
        isLoading,
        error: error as Error | null,
        searchTerm,
        setSearchTerm,
        selectedIndustries,
        setSelectedIndustries,
        selectedSizes,
        setSelectedSizes,
        refetchCompanies,
    }

    return (
        <CompaniesContext.Provider value={value}>
            {children}
        </CompaniesContext.Provider>
    )
}
