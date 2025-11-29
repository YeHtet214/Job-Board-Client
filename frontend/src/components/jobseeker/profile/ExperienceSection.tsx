import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Building, Calendar, MapPin, Briefcase } from 'lucide-react'
import { Experience } from '@/types/profile'
import { formatDate } from '@/lib/formatters'

interface ExperienceSectionProps {
    experience?: Experience[]
}

const ExperienceSection = ({ experience }: ExperienceSectionProps) => {

    const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean) => {
        const start = formatDate(startDate, { month: 'short', year: 'numeric' })
        const end = isCurrent ? 'Present' : formatDate(endDate || '', { month: 'short', year: 'numeric' })
        return `${start} - ${end}`
    }

    return (
        <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-accent/20 py-5">
                <CardTitle className="text-xl font-semibold text-jb-primary flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-jb-primary" />
                    Work Experience
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {experience?.length ? (
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <div
                                key={exp.id || index}
                                className="border-b border-border/50 pb-6 last:border-0 last:pb-0"
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Position Title */}
                                    <div>
                                        <h3 className="text-lg font-bold text-jb-text">
                                            {exp.position}
                                        </h3>
                                    </div>

                                    {/* Company, Location, and Date */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div className="flex items-center text-jb-text-muted">
                                                <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                                                <span className="font-semibold text-jb-text/90">{exp.company}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-jb-text-muted bg-muted/50 px-3 py-1.5 rounded-md w-fit">
                                                <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                                <span className="font-medium">
                                                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        {exp.location && (
                                            <div className="flex items-center text-jb-text-muted text-sm">
                                                <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                                <span>{exp.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {exp.description && (
                                        <p className="mt-2 text-jb-text/80 whitespace-pre-line leading-relaxed text-sm">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-jb-text-muted">
                        <Building className="h-12 w-12 mx-auto opacity-30 mb-3" />
                        <p>No work experience added yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ExperienceSection
