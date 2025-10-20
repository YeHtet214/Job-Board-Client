import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { CompanyProfileForm } from '@/components/company'
import { useMyCompany } from '@/hooks/react-queries/company'
import { useToast } from '@/components/ui/use-toast'

const CompanyProfileEditPage = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Fetch company data
    const { data: company, isLoading } = useMyCompany()

    // Redirect if not employer
    useEffect(() => {
        if (currentUser?.role !== 'EMPLOYER') {
            toast({
                title: 'Warning',
                description:
                    'Only employer is permitted to edit company profile',
            })
            navigate('/')
        }
    }, [currentUser, navigate])

    // Redirect if no company profile exists
    useEffect(() => {
        if (!isLoading && !company) {
            navigate('/employer/company')
        }
    }, [company, isLoading, navigate])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                Edit Company Profile
            </h1>

            {company && (
                <CompanyProfileForm company={company} isNewCompany={false} />
            )}
        </div>
    )
}

export default CompanyProfileEditPage
