import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building, Globe, Users, Trophy, ChevronRight, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Company } from '@/types/company'
import { useFeaturedCompanies } from '@/hooks/react-queries/company/useCompanyQueries'

interface FeaturedCompaniesSectionProps {
    companiesRef: React.RefCallback<HTMLElement>
    companiesInView: boolean
    fadeIn: any
    staggerContainer: any
    cardVariants: any
}

const FeaturedCompaniesSection: React.FC<FeaturedCompaniesSectionProps> = ({
    companiesRef,
    companiesInView,
    fadeIn,
    staggerContainer,
    cardVariants,
}) => {
    const { data: companiesData, isLoading } = useFeaturedCompanies()

    const renderCompanies = () => {
        if (isLoading) {
            return Array(4)
                .fill(0)
                .map((_, index) => (
                    <motion.div
                        key={`skeleton-${index}`}
                        variants={cardVariants}
                    >
                        <Card className="h-full border border-jb-border shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Skeleton className="w-16 h-16 rounded-lg" />
                                    <Skeleton className="w-20 h-6 rounded-full" />
                                </div>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
        }

        if (!companiesData || companiesData.companies.length === 0) {
            return (
                <div className="col-span-full text-center py-12 bg-jb-surface/30 rounded-lg border border-dashed border-jb-border">
                    <Building className="w-12 h-12 text-jb-text-muted mx-auto mb-3" />
                    <p className="text-jb-text-muted">No featured companies available at the moment.</p>
                </div>
            )
        }

        return companiesData.companies.map((company: Company) => {
            const industryIcons: { [key: string]: React.ReactNode } = {
                Technology: <Globe className="w-5 h-5" />,
                Finance: <Trophy className="w-5 h-5" />,
                Healthcare: <Users className="w-5 h-5" />,
                default: <Building className="w-5 h-5" />,
            }

            const industryIcon =
                industryIcons[company.industry] || industryIcons.default

            return (
                <motion.div
                    key={company.id}
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                    className="h-full"
                >
                    <Link to={`/companies/${company.id}`} className="block h-full">
                        <Card className="h-full border border-jb-border hover:border-jb-primary/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-jb-primary to-jb-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-jb-surface flex items-center justify-center border border-jb-border overflow-hidden">
                                        {company.logo ? (
                                            <img
                                                src={company.logo}
                                                alt={company.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-jb-primary/60">
                                                {industryIcon}
                                            </div>
                                        )}
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-jb-primary/10 text-jb-primary border border-jb-primary/20">
                                        {company.industry}
                                    </span>
                                </div>

                                <div className="mb-4 flex-grow">
                                    <h3 className="text-lg font-bold text-jb-text group-hover:text-jb-primary transition-colors duration-200 line-clamp-1 mb-1">
                                        {company.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-jb-text-muted mb-3">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                                        <span className="line-clamp-1">{company.location}</span>
                                    </div>
                                    <p className="text-sm text-jb-text-muted/80 line-clamp-2">
                                        {company.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-jb-border flex items-center justify-between text-xs text-jb-text-muted mt-auto">
                                    <div className="flex items-center">
                                        <Users className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{company.size || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-jb-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        View Profile
                                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            )
        })
    }

    return (
        <motion.section
            ref={companiesRef}
            initial="hidden"
            animate={companiesInView ? 'visible' : 'hidden'}
            variants={fadeIn}
            className="py-20 bg-gradient-to-b from-transparent to-jb-surface/30"
        >
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div className="max-w-2xl">
                        <motion.h2
                            className="text-3xl font-bold mb-3 text-jb-text"
                            variants={fadeIn}
                        >
                            Featured Companies
                        </motion.h2>
                        <motion.p
                            className="text-jb-text-muted text-lg"
                            variants={fadeIn}
                        >
                            Discover top employers hiring now. Research company profiles, read reviews, and explore opportunities.
                        </motion.p>
                    </div>
                    <motion.div variants={fadeIn}>
                        <Button
                            asChild
                            variant="outline"
                            className="hidden md:inline-flex border-jb-border hover:bg-jb-surface text-jb-text"
                        >
                            <Link to="/companies" className="flex items-center gap-2">
                                View All Companies
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={staggerContainer}
                >
                    {renderCompanies()}
                </motion.div>

                <div className="mt-8 text-center md:hidden">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full border-jb-border hover:bg-jb-surface text-jb-text"
                    >
                        <Link to="/companies" className="flex items-center justify-center gap-2">
                            View All Companies
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.section>
    )
}

export default FeaturedCompaniesSection
