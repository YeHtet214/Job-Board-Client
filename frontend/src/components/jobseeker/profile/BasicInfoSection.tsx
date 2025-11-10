import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Profile } from '@/types/profile'
import { User } from '@/types/user'

interface BasicInfoSectionProps {
    profile: Profile
    currentUser: User | null
}

const BasicInfoSection = ({ profile, currentUser }: BasicInfoSectionProps) => {
    return (
        <Card className="border border-border shadow-sm pt-0">
            <CardHeader className="border-b bg-accent/30 py-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
                        <AvatarImage src={profile.profileImageURL} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                            {currentUser?.firstName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl text-foreground">
                            {currentUser?.firstName || 'Job Seeker'}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">
                            {currentUser?.email || ''}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                            Bio
                        </h3>
                        <p className="text-foreground/90 whitespace-pre-line">
                            {profile.bio}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                            Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills?.map((skill, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-foreground hover:bg-accent"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInfoSection
