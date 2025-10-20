import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, BookOpen, Building, Link } from 'lucide-react'
import { Profile } from '@/types/profile'
import { useAuth } from '@/contexts/authContext'

// Import section components
import BasicInfoSection from './BasicInfoSection'
import EducationSection from './EducationSection'
import ExperienceSection from './ExperienceSection'
import LinksResumeSection from './LinksResumeSection'

interface ProfileTabsProps {
    profile: Profile
    viewTab: string
    setViewTab: (tab: string) => void
}

const ProfileTabs = ({ profile, viewTab, setViewTab }: ProfileTabsProps) => {
    const { currentUser } = useAuth()

    return (
        <Tabs value={viewTab} onValueChange={setViewTab} className="w-full">
            <div className="overflow-x-auto pb-1">
                <TabsList className="w-full mb-6 bg-background border border-border min-w-max md:w-auto">
                    <TabsTrigger
                        value="overview"
                        className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-accent/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-4"
                    >
                        <User className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="education"
                        className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-accent/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-4"
                    >
                        <BookOpen className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Education</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="experience"
                        className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-accent/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-4"
                    >
                        <Building className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Experience</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="links"
                        className="text-xs sm:text-sm md:text-base flex-1 whitespace-nowrap data-[state=active]:bg-accent/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-4"
                    >
                        <Link className="inline-block h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span>Links & Resume</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0">
                <BasicInfoSection profile={profile} currentUser={currentUser} />
            </TabsContent>

            <TabsContent value="education" className="mt-0">
                <EducationSection education={profile.education} />
            </TabsContent>

            <TabsContent value="experience" className="mt-0">
                <ExperienceSection experience={profile.experience} />
            </TabsContent>

            <TabsContent value="links" className="mt-0">
                <LinksResumeSection
                    linkedInUrl={profile.linkedInUrl}
                    githubUrl={profile.githubUrl}
                    portfolioUrl={profile.portfolioUrl}
                    resumeUrl={profile.resumeUrl}
                />
            </TabsContent>
        </Tabs>
    )
}

export default ProfileTabs
