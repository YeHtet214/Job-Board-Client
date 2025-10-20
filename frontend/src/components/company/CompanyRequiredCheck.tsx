import { useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useMyCompany } from '../../hooks/react-queries/company'
import LoadingSpinner from '../ui/LoadingSpinner'

interface CompanyRequiredCheckProps {
    children: ReactNode
}

/**
 * A component that checks if the employer has created a company profile
 * If not, it redirects to the company profile creation page
 */
const CompanyRequiredCheck = ({ children }: CompanyRequiredCheckProps) => {
    const navigate = useNavigate()
    const { data: company, isLoading } = useMyCompany()

    useEffect(() => {
        if (!isLoading && !company) {
            toast.error(
                'You need to create a company profile first before posting a job'
            )
            navigate('/company/profile')
        }
    }, [company, isLoading, navigate])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    // Only render children if company exists
    return company ? <>{children}</> : null
}

export default CompanyRequiredCheck
