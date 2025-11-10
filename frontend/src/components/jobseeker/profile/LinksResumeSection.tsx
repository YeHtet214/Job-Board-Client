import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award } from 'lucide-react'

interface LinksResumeSectionProps {
    linkedInUrl?: string
    githubUrl?: string
    portfolioUrl?: string
    resumeUrl?: string
}

const LinksResumeSection = ({
    linkedInUrl,
    githubUrl,
    portfolioUrl,
    resumeUrl,
}: LinksResumeSectionProps) => {
    return (
        <Card className="border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl text-jb-primary">
                    Links & Resume
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {linkedInUrl || githubUrl || portfolioUrl ? (
                        <div className="space-y-3">
                            {linkedInUrl && (
                                <a
                                    href={linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-jb-primary hover:underline"
                                >
                                    <Badge
                                        variant="outline"
                                        className="border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]/10"
                                    >
                                        LinkedIn
                                    </Badge>
                                    <span className="text-foreground/90">
                                        {linkedInUrl}
                                    </span>
                                </a>
                            )}
                            {githubUrl && (
                                <a
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-jb-primary hover:underline"
                                >
                                    <Badge
                                        variant="outline"
                                        className="border-foreground text-foreground hover:bg-accent"
                                    >
                                        GitHub
                                    </Badge>
                                    <span className="text-foreground/90">
                                        {githubUrl}
                                    </span>
                                </a>
                            )}
                            {portfolioUrl && (
                                <a
                                    href={portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-jb-primary hover:underline"
                                >
                                    <Badge
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10"
                                    >
                                        Portfolio
                                    </Badge>
                                    {portfolioUrl}
                                </a>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">No links added yet</p>
                    )}

                    <div className="mt-6 pt-6 border-t">
                        <h3 className="text-md font-semibold mb-3 text-foreground">
                            Resume
                        </h3>
                        {resumeUrl ? (
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-jb-primary rounded-md text-sm font-medium text-jb-primary hover:bg-jb-primary/10"
                            >
                                <Award className="h-4 w-4 mr-2" />
                                View Resume
                            </a>
                        ) : (
                            <p className="text-gray-500">
                                No resume uploaded yet
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LinksResumeSection
