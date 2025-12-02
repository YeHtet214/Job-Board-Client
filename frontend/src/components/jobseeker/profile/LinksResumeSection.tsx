import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Linkedin, Github, Globe, ExternalLink, FileText } from 'lucide-react'

interface LinksResumeSectionProps {
    linkedInUrl?: string
    githubUrl?: string
    portfolioUrl?: string
    resume?: string
}

const LinksResumeSection = ({
    linkedInUrl,
    githubUrl,
    portfolioUrl,
    resume,
}: LinksResumeSectionProps) => {
    const hasLinks = linkedInUrl || githubUrl || portfolioUrl

    console.log("resume: ", resume)

    return (
        <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-accent/20">
                <CardTitle className="text-xl font-semibold text-jb-text flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Links & Resume
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {/* Social Links Section */}
                    <div>
                        <h3 className="text-md font-semibold mb-4 text-jb-text">
                            Social Links
                        </h3>
                        {hasLinks ? (
                            <div className="space-y-3">
                                {linkedInUrl && (
                                    <a
                                        href={linkedInUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5]/10">
                                            <Linkedin className="h-5 w-5 text-[#0077B5]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-jb-text">LinkedIn</span>
                                                <ExternalLink className="h-3 w-3 text-jb-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-jb-text-muted truncate">
                                                {linkedInUrl}
                                            </p>
                                        </div>
                                    </a>
                                )}
                                {githubUrl && (
                                    <a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-jb-text/10">
                                            <Github className="h-5 w-5 text-jb-text" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-jb-text">GitHub</span>
                                                <ExternalLink className="h-3 w-3 text-jb-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-jb-text-muted truncate">
                                                {githubUrl}
                                            </p>
                                        </div>
                                    </a>
                                )}
                                {portfolioUrl && (
                                    <a
                                        href={portfolioUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-jb-primary/10">
                                            <Globe className="h-5 w-5 text-jb-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-jb-text">Portfolio</span>
                                                <ExternalLink className="h-3 w-3 text-jb-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-jb-text-muted truncate">
                                                {portfolioUrl}
                                            </p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-jb-text-muted">
                                <ExternalLink className="h-10 w-10 mx-auto opacity-30 mb-2" />
                                <p className="text-sm">No links added yet</p>
                            </div>
                        )}
                    </div>

                    {/* Resume Section */}
                    <div className="pt-6 border-t border-border">
                        <h3 className="text-md font-semibold mb-4 text-jb-text">
                            Resume
                        </h3>
                        {resume ? (
                            <a
                                href={resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 rounded-lg border-2 border-jb-primary/30 bg-jb-primary/5 hover:bg-jb-primary/10 transition-colors group"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-jb-primary/10">
                                    <FileText className="h-6 w-6 text-jb-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-jb-text">View Resume</span>
                                        <ExternalLink className="h-4 w-4 text-jb-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-sm text-jb-text-muted">Click to open in new tab</p>
                                </div>
                            </a>
                        ) : (
                            <div className="text-center py-6 text-jb-text-muted">
                                <FileText className="h-10 w-10 mx-auto opacity-30 mb-2" />
                                <p className="text-sm">No resume uploaded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LinksResumeSection
