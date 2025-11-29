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
import { Mail, User as UserIcon } from 'lucide-react'

const BasicInfoSection = ({ profile }: { profile: Profile }) => {
    const getInitials = () => {
        if (profile.firstName && profile.lastName) {
            return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
        }
        if (profile.firstName) {
            return profile.firstName.charAt(0).toUpperCase()
        }
        if (profile.email) {
            return profile.email.charAt(0).toUpperCase()
        }
        return <UserIcon />
    }

    // Get display name
    const getDisplayName = () => {
        if (profile.firstName && profile.lastName) {
            return `${profile.firstName} ${profile.lastName}`
        }
        if (profile.firstName) {
            return profile.firstName
        }
        return 'Job Seeker'
    }

    return (
        <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-accent/30 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                        <AvatarImage src={profile.profileImageURL} alt={getDisplayName()} />
                        <AvatarFallback className="bg-jb-primary text-white text-2xl font-semibold">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl font-bold text-jb-text mb-2">
                            {getDisplayName()}
                        </CardTitle>
                        {profile.email && (
                            <CardDescription className="flex items-center gap-2 text-jb-text-muted text-base">
                                <Mail className="h-4 w-4" />
                                {profile.email}
                            </CardDescription>
                        )}
                        {profile.role && (
                            <div className="mt-3">
                                <Badge
                                    variant="secondary"
                                    className="bg-jb-primary/10 text-jb-primary border border-jb-primary/20 font-medium"
                                >
                                    <UserIcon className="h-3 w-3 mr-1.5" />
                                    {profile.role}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {profile.bio && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-jb-text flex items-center gap-2">
                                About Me
                            </h3>
                            <p className="text-jb-text/80 whitespace-pre-line leading-relaxed">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-jb-text">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, i) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!profile.bio && (!profile.skills || profile.skills.length === 0)) && (
                        <div className="text-center py-8 text-jb-text-muted">
                            <UserIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>No additional information available</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInfoSection
