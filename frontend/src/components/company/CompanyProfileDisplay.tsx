import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card'
import { Globe, MapPin, Briefcase, Calendar, Users, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Company } from '@/types/company'
import ChatMessage from '../messaging/ChatMessage'

interface CompanyProfileDisplayProps {
    company: Company
}

const CompanyProfileDisplay: React.FC<CompanyProfileDisplayProps> = ({
    company,
}) => {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {company.logo ? (
                                <img
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    className="w-16 h-16 rounded-md object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md flex items-center justify-center text-jb-text-muted">
                                    {company.name?.charAt(0) || 'C'}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-2xl text-jb-text">
                                    {company.name}
                                </CardTitle>
                                <CardDescription className="text-base text-jb-text-secondary">
                                    {company.industry}
                                </CardDescription>
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate('/employer/company/edit')}
                            className="flex items-center border-jb-border border-1 gap-2 text-jb-text hover:text-jb-primary hover:bg-jb-primary/10"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 text-jb-text">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">About</h3>
                        <p className="whitespace-pre-line">
                            {company.description}
                        </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Company Information
                            </h3>

                            {company.location && (
                                <div className="flex items-center gap-3 text-jb-text">
                                    <MapPin className="h-5 w-5 text-jb-text-muted" />
                                    <span>{company.location}</span>
                                </div>
                            )}

                            {company.website && (
                                <div className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-jb-text-muted" />
                                    <a
                                        href={
                                            company.website.startsWith('http')
                                                ? company.website
                                                : `https://${company.website}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-jb-purple hover:underline"
                                    >
                                        {company.website.replace(
                                            /^(https?:\/\/)?(www\.)?/,
                                            ''
                                        )}
                                    </a>
                                </div>
                            )}

                            {company.foundedYear && (
                                <div className="flex items-center gap-3 text-jb-text">
                                    <Calendar className="h-5 w-5 text-jb-text-muted" />
                                    <span>
                                        Founded in {company.foundedYear}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Additional Details
                            </h3>

                            {company.industry && (
                                <div className="flex items-center gap-3 text-jb-text">
                                    <Briefcase className="h-5 w-5 text-jb-text-muted" />
                                    <span>{company.industry}</span>
                                </div>
                            )}

                            {company.size && (
                                <div className="flex items-center gap-3 text-jb-text">
                                    <Users className="h-5 w-5 text-jb-text-muted" />
                                    <span>{company.size}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-2 pb-6 flex justify-center">
                    <Button
                        onClick={() => navigate('/employer/jobs/create')}
                        variant="outline"
                        className="border-jb-border border-1 text-white bg-jb-primary hover:bg-jb-primary/10 transition-all"
                    >
                        Post a New Job
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CompanyProfileDisplay
