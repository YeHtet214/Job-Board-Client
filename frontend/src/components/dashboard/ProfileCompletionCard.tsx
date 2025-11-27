import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, User, Building } from 'lucide-react'
import Progress from '@/components/ui/Progress'

interface CompletionItem {
    completed: boolean
    text: string
}

interface ProfileCompletionCardProps {
    title: string
    description: string
    completionPercentage: number
    completionItems: CompletionItem[]
    profilePath: string
    buttonText: string
    isJobSeeker?: boolean
}

const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
    title,
    description,
    completionPercentage,
    completionItems,
    profilePath,
    buttonText,
    isJobSeeker = true,
}) => {
    const navigate = useNavigate()

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {completionPercentage < 100 && (
                        <Progress value={completionPercentage} />
                    )}

                    <ul className="space-y-3">
                        {completionItems.map((item, index) => (
                            <li
                                key={index}
                                className={`flex items-center text-sm ${!item.completed ? 'text-jb-text-muted' : ''}`}
                            >
                                {item.completed ? (
                                    <CheckCircle className="h-4 w-4 text-jb-success mr-2" />
                                ) : (
                                    <div className="h-4 w-4 border border-jb-text-muted rounded-full mr-2"></div>
                                )}
                                <span>{item.text}</span>
                            </li>
                        ))}
                    </ul>

                    <Button
                        className="w-full bg-jb-primary text-white hover:bg-jb-primary/90"
                        onClick={() => navigate(profilePath)}
                    >
                        {isJobSeeker ? (
                            <User className="h-4 w-4 mr-2" />
                        ) : (
                            <Building className="h-4 w-4 mr-2" />
                        )}
                        {buttonText}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileCompletionCard
