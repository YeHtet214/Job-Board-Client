import React, { useEffect, useState } from 'react'
import { Building, MapPin, Briefcase, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Link, useSearchParams } from 'react-router-dom'
import CompanyFilters from '@/components/company/CompanyFilters'
import { CompaniesProvider } from '@/contexts/CompaniesContext'
import { useAuth } from '@/contexts/authContext'
import { useFetchCompaniesQuery, useMyCompany } from '@/hooks/react-queries/company'
import ReactPaginate from 'react-paginate'
import { Company } from '@/types/company'

export interface CompanySearchParams {
    currentPage: number
    pageSize: number
    searchTerm: string
    industry: string
    companySize: string | null
}

const CompaniesPageContent: React.FC = () => {
    const pageSize = 10
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentpage] = useState(1)
    const [params, setParams] = useState<CompanySearchParams>({
        currentPage, pageSize,
        searchTerm: searchParams.get('searchTerm') || '',
        industry: searchParams.get('industry') || '',
        companySize: searchParams.get('companySize') || null
    })

    // Get current user and check if they have a company
    const { currentUser } = useAuth()
    const isEmployer = currentUser?.role === 'EMPLOYER'
    const { data: userCompany } = isEmployer ? useMyCompany() : { data: null }

    const { data, isLoading } = useFetchCompaniesQuery(params)

    const totalPages = data?.meta?.totalPages || 0

    useEffect(() => {
        setParams({
            currentPage,
            pageSize,
            searchTerm: searchParams.get('searchTerm') || '',
            industry: searchParams.get('industry') || '',
            companySize: searchParams.get('companySize') || null
        })
    }, [searchParams, currentPage])

    const handlePageClick = (event) => {
        console.log(
            `User requested page number ${event.selected}`
        )
        setCurrentpage(event.selected + 1)
    }

    return (
        <section>
            <div className="bg-jb-bg py-10">
                <div className="container mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl font-bold text-jb-text mb-2">
                        Browse Companies
                    </h1>
                    <p className="text-jb-text-muted mb-8 max-w-2xl">
                        Discover top employers hiring now. Research company
                        profiles, read reviews, and explore job opportunities.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Sidebar with filters */}
                        <div className="md:col-span-1">
                            <CompanyFilters
                                updateParams={(value) => setSearchParams(value)}
                            />

                            {/* Employer CTA */}
                            <div className="mt-8 bg-gradient-to-r from-jb-primary to-jb-surface rounded-lg shadow-lg p-6 text-center">
                                <Building className="h-12 w-12 mx-auto text-white mb-4" />
                                <h2 className="text-xl font-bold text-white mb-3">
                                    Are You an Employer?
                                </h2>
                                <p className="text-white/80 mb-6 text-sm">
                                    {!isEmployer
                                        ? 'Create your company profile and start posting jobs to find the perfect candidates.'
                                        : userCompany
                                            ? 'Manage your company profile and continue posting jobs to find the perfect candidates.'
                                            : 'Create your company profile and start posting jobs to find the perfect candidates.'}
                                </p>
                                {!isEmployer ? (
                                    <Link to="/register?role=EMPLOYER">
                                        <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
                                            Register as Employer
                                        </Button>
                                    </Link>
                                ) : userCompany ? (
                                    <Link to="/employer/company/profile">
                                        <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
                                            Manage Company Profile
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/employer/company/profile">
                                        <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
                                            Create Company Profile
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Company Listings */}
                        <div className="md:col-span-3">
                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <Card
                                            key={index}
                                            className="overflow-hidden"
                                        >
                                            <CardContent className="p-0">
                                                <div className="h-32 bg-jb-surface"></div>
                                                <div className="p-6">
                                                    <Skeleton className="h-6 w-3/4 mb-4 bg-jb-surface" />
                                                    <Skeleton className="h-4 w-full mb-2 bg-jb-surface" />
                                                    <Skeleton className="h-4 w-full mb-2 bg-jb-surface" />
                                                    <Skeleton className="h-4 w-2/3 bg-jb-surface" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : data?.companies?.length === 0 ? (
                                <div className="text-center py-12">
                                    <Building className="h-16 w-16 mx-auto text-jb-text-muted mb-4" />
                                    <h3 className="text-xl font-semibold text-jb-text mb-2">
                                        No companies found
                                    </h3>
                                    <p className="text-jb-text-muted">
                                        Try adjusting your search or filters to
                                        find what you're looking for.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {data?.companies?.map((company: Company) => (
                                            <Link
                                                to={`/companies/${company.id}`}
                                                key={company.id}
                                            >
                                                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                                                    <CardContent className="p-0">
                                                        <div className="h-32 bg-gradient-to-r from-jb-primary/10 to-jb-surface/10 relative">
                                                            {company.logo ? (
                                                                <img
                                                                    src={
                                                                        company.logo
                                                                    }
                                                                    alt={`${company.name} logo`}
                                                                    className="absolute bottom-0 left-6 w-16 h-16 rounded-md border-2 border-white bg-white object-contain"
                                                                />
                                                            ) : (
                                                                <div className="absolute bottom-0 left-6 w-16 h-16 rounded-md border-2 border-white bg-white flex items-center justify-center">
                                                                    <Building className="h-8 w-8 text-jb-primary" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-6 pt-4">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-xl font-semibold text-jb-text mt-2">
                                                                    {company.name}
                                                                </h3>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-jb-surface text-jb-text-muted border-jb-surface-muted"
                                                                >
                                                                    {
                                                                        company.industry
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center text-jb-text-muted mt-2 text-sm">
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                <span>
                                                                    {
                                                                        company.location
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="text-jb-text-muted mt-3 text-sm line-clamp-2">
                                                                {
                                                                    company.description
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-4 mt-4">
                                                                {company.size && (
                                                                    <div className="flex items-center text-xs text-jb-text-muted">
                                                                        <Users className="h-3 w-3 mr-1" />
                                                                        <span>
                                                                            {
                                                                                company.size
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {company.foundedYear && (
                                                                    <div className="flex items-center text-xs text-jb-text-muted">
                                                                        <Briefcase className="h-3 w-3 mr-1" />
                                                                        <span>
                                                                            Est.{' '}
                                                                            {
                                                                                company.foundedYear
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                    <ReactPaginate
                                        breakLabel="..."
                                        nextLabel="next >"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={5}
                                        pageCount={totalPages}
                                        previousLabel="< previous"
                                        renderOnZeroPageCount={null}
                                        className='flex gap-4 py-4 items-center justify-center'
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const CompaniesPage: React.FC = () => {
    return (
        <CompaniesProvider>
            <CompaniesPageContent />
        </CompaniesProvider>
    )
}

export default CompaniesPage
