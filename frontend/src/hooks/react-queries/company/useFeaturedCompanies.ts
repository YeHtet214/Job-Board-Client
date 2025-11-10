import { useQuery } from '@tanstack/react-query'
import companyService from '@/services/company.service'

const useFeaturedCompanies = (limit: number = 6) => {
    return useQuery({
        queryKey: ['featuredCompanies', limit],
        queryFn: async () => {
            const companies = await companyService.getAllCompanies()
            // Limit the number of companies to return based on the limit parameter
            return {
                companies: companies.slice(0, limit),
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

export default useFeaturedCompanies
