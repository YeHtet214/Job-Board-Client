import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    Building,
    MapPin,
    Globe,
    Calendar,
    Users,
    Briefcase,
    ChevronLeft,
    Mail,
    ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
    useCompany,
    useCompanyJobs,
} from '@/hooks/react-queries/company/useCompanyQueries'
import { Job } from '@/types/job'
import { useAuth } from '@/contexts/authContext'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ConversationDialog from '@/components/messaging/ConversationDialog'
import { Conversation } from '@/types/messaging'

// Add a custom hook for company jobs

const CompanyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [activeTab, setActiveTab] = useState('about')
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Fetch company data using the custom hook
    const {
        data: company,
        isLoading: isLoadingCompany,
        error: companyError,
    } = useCompany(id || '')

    // Fetch company jobs
    const { data: companyJobs = [], isLoading: isLoadingJobs } =
        useCompanyJobs(id)

    const isLoading = isLoadingCompany || isLoadingJobs

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="max-w-5xl mx-auto">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200" />
                        <div className="p-6">
                            <div className="flex items-start">
                                <Skeleton className="h-20 w-20 rounded-md mr-6" />
                                <div className="flex-1">
                                    <Skeleton className="h-8 w-3/4 mb-4" />
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <Skeleton className="h-4 w-1/3 mb-6" />
                                    <div className="flex gap-3">
                                        <Skeleton className="h-10 w-24" />
                                        <Skeleton className="h-10 w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Skeleton className="h-12 w-full mb-6" />
                        <Skeleton className="h-32 w-full mb-4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (companyError || !company) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
                <h1>Hello</h1>
                <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Company Not Found
                </h2>
                <p className="text-gray-500 mb-6">
                    The company you're looking for doesn't exist or has been
                    removed.
                </p>
                <Link to="/companies">
                    <Button>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Companies
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <Link
                    to="/companies"
                    className="inline-flex items-center text-jb-primary hover:text-jb-primary/90 mb-6"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Companies
                </Link>

                {/* Company Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 relative">
                    <div className="h-48 bg-gradient-to-r from-jb-primary/20 to-jb-success/20" />
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start">
                            <div className="absolute top-36 left-8 w-20 h-20 sm:w-24 sm:h-24 rounded-md border-4 border-white bg-white flex items-center justify-center shadow-md">
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={`${company.name || "logo"}`}
                                        className="w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <Building className="h-12 w-12 text-jobboard-purple" />
                                )}
                            </div>
                            <div className="sm:ml-28 flex-1 mt-12 sm:mt-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-jobboard-darkblue">
                                            {company.name}
                                        </h1>
                                        <div className="flex items-center text-gray-600 mt-2">
                                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                            <span>{company.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        {company.website && (
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Globe className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Visit Website
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Website
                                                    </span>
                                                </Button>
                                            </a>
                                        )}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    <span className="hidden sm:inline">
                                                        Contact Company
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Contact
                                                    </span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <ConversationDialog conv={{
                                                    receipent: {
                                                        id: company.id,
                                                        name: company.name,
                                                        avatar: company.logo || "",
                                                    },
                                                } as Conversation} />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    <Badge
                                        variant="outline"
                                        className="bg-jobboard-light/50"
                                    >
                                        {company.industry}
                                    </Badge>
                                    {company.size && (
                                        <Badge
                                            variant="outline"
                                            className="bg-jobboard-light/50"
                                        >
                                            {company.size}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs
                    defaultValue="about"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-2 mb-8">
                        <TabsTrigger
                            value="about"
                            className="flex items-center gap-2"
                        >
                            <Building className="h-4 w-4" />
                            About
                        </TabsTrigger>
                        <TabsTrigger
                            value="jobs"
                            className="flex items-center gap-2"
                        >
                            <Briefcase className="h-4 w-4" />
                            Open Jobs ({companyJobs.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h2 className="text-xl font-semibold text-jobboard-darkblue mb-4">
                                    About {company.name}
                                </h2>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {company.description}
                                </p>

                                <div className="grid grid-cols-1 md:!grid-cols-2 gap-6 mt-8">
                                    <div className="flex items-start">
                                        <div className="bg-jobboard-light/50 p-3 rounded-md mr-4">
                                            <MapPin className="h-5 w-5 text-jobboard-purple" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-jobboard-darkblue">
                                                Location
                                            </h3>
                                            <p className="text-gray-600">
                                                {company.location}
                                            </p>
                                        </div>
                                    </div>

                                    {company.foundedYear && (
                                        <div className="flex items-start">
                                            <div className="bg-jobboard-light/50 p-3 rounded-md mr-4">
                                                <Calendar className="h-5 w-5 text-jobboard-purple" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-jobboard-darkblue">
                                                    Founded
                                                </h3>
                                                <p className="text-gray-600">
                                                    {company.foundedYear}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <div className="bg-jobboard-light/50 p-3 rounded-md mr-4">
                                            <Building className="h-5 w-5 text-jobboard-purple" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-jobboard-darkblue">
                                                Industry
                                            </h3>
                                            <p className="text-gray-600">
                                                {company.industry}
                                            </p>
                                        </div>
                                    </div>

                                    {company.size && (
                                        <div className="flex items-start">
                                            <div className="bg-jobboard-light/50 p-3 rounded-md mr-4">
                                                <Users className="h-5 w-5 text-jobboard-purple" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-jobboard-darkblue">
                                                    Company Size
                                                </h3>
                                                <p className="text-gray-600">
                                                    {company.size}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {company.website && (
                                        <div className="flex items-start">
                                            <div className="bg-jobboard-light/50 p-3 rounded-md mr-4">
                                                <Globe className="h-5 w-5 text-jobboard-purple" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-jobboard-darkblue">
                                                    Website
                                                </h3>
                                                <a
                                                    href={company.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-jobboard-purple hover:underline flex items-center"
                                                >
                                                    {company.website}
                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="jobs" className="space-y-6">
                        {companyJobs.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6 text-center py-12">
                                    <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                        No Open Positions
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        {company.name} doesn't have any open
                                        positions at the moment. Check back
                                        later for new opportunities.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {companyJobs.map((job: Job) => (
                                    <Link to={`/jobs/${job.id}`} key={job.id}>
                                        <Card className="hover:shadow-md transition-shadow duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-jobboard-darkblue">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center text-gray-600 mt-1">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {job.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            job.type ===
                                                                'FULL_TIME'
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className={
                                                            job.type ===
                                                                'FULL_TIME'
                                                                ? 'bg-jobboard-purple'
                                                                : ''
                                                        }
                                                    >
                                                        {job.type.replace(
                                                            '_',
                                                            ' '
                                                        )}
                                                    </Badge>
                                                </div>

                                                <p className="text-gray-600 mt-3 line-clamp-2">
                                                    {job.description}
                                                </p>

                                                {job.requiredSkills &&
                                                    job.requiredSkills.length >
                                                    0 && (
                                                        <div className="flex flex-wrap gap-2 mt-4">
                                                            {job.requiredSkills
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        skill: string,
                                                                        index: number
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                index
                                                                            }
                                                                            variant="outline"
                                                                            className="bg-jobboard-light/50"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </Badge>
                                                                    )
                                                                )}
                                                            {job.requiredSkills
                                                                .length > 3 && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-jobboard-light/50"
                                                                    >
                                                                        +
                                                                        {job
                                                                            .requiredSkills
                                                                            .length -
                                                                            3}{' '}
                                                                        more
                                                                    </Badge>
                                                                )}
                                                        </div>
                                                    )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default CompanyDetailPage
