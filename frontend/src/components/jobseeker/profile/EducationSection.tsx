import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { GraduationCap, Calendar, BookMarked } from 'lucide-react'
import { Education } from '@/types/profile'
import { formatDate } from '@/lib/formatters'

interface EducationSectionProps {
    education?: Education[]
}

const EducationSection = ({ education }: EducationSectionProps) => {
    const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean) => {
        const start = formatDate(startDate, { month: 'short', year: 'numeric' })
        const end = isCurrent ? 'Present' : formatDate(endDate || '', { month: 'short', year: 'numeric' })
        return `${start} - ${end}`
    }

    return (
        <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="border-b border-border bg-accent/20 py-5">
                <CardTitle className="text-xl font-semibold text-jb-primary flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-jb-primary" />
                    Education
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {education?.length ? (
                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <div
                                key={edu.id || index}
                                className="border-b border-border/50 pb-6 last:border-0 last:pb-0"
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Degree and Field */}
                                    <div>
                                        <h3 className="text-lg font-bold text-jb-text">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-base text-jb-text/90 mt-1 flex items-center gap-2">
                                            <BookMarked className="h-4 w-4 text-jb-primary" />
                                            {edu.fieldOfStudy}
                                        </p>
                                    </div>

                                    {/* Institution and Date */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center text-jb-text-muted">
                                            <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span className="font-medium">{edu.institution}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-jb-text-muted bg-muted/50 px-3 py-1.5 rounded-md w-fit">
                                            <Calendar className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                            <span className="font-medium">
                                                {formatDateRange(edu.startDate, edu.endDate, edu.isCurrent)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {edu.description && (
                                        <p className="mt-2 text-jb-text/80 leading-relaxed text-sm">
                                            {edu.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-jb-text-muted">
                        <GraduationCap className="h-12 w-12 mx-auto opacity-30 mb-3" />
                        <p>No education information added yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EducationSection
