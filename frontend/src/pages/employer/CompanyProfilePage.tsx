import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { CompanyProfileForm, CompanyProfileDisplay } from '@/components/company'
import { useMyCompany } from '@/hooks/react-queries/company'

const CompanyProfilePage = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    // Fetch company data
    const { data: company, isLoading } = useMyCompany()

    // Redirect if not employer
    useEffect(() => {
        if (currentUser?.role !== 'EMPLOYER') {
            navigate('/')
        }
    }, [currentUser, navigate])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    const isNewCompany = !company

    return (
        <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-8 text-jobboard-darkblue">
                {isNewCompany ? 'Create Company Profile' : 'Company Profile'}
            </h1>

            {isNewCompany && (
                <Card className="mb-8 border-l-4 border-l-jb-primary">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Info className="h-6 w-6 text-jobboard-purple flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Complete Your Company Profile
                                </h3>
                                <p className="text-gray-600">
                                    As an employer, you need to create a company
                                    profile before you can post jobs. This
                                    information will be displayed to job
                                    seekers, so make it comprehensive and
                                    accurate.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isNewCompany ? (
                <CompanyProfileForm company={null} isNewCompany={true} />
            ) : (
                <CompanyProfileDisplay company={company} />
            )}
        </div>
    )
}

export default CompanyProfilePage
