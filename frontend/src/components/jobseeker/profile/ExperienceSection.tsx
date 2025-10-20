import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Building, Calendar, MapPin } from 'lucide-react'
import { Experience } from '@/types/profile'

interface ExperienceSectionProps {
    experience?: Experience[]
}

const ExperienceSection = ({ experience }: ExperienceSectionProps) => {
    return (
        <Card className="border border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl text-jb-primary">
                    Work Experience
                </CardTitle>
            </CardHeader>
            <CardContent>
                {experience?.length ? (
                    <div className="space-y-6">
                        {experience.map((exp, index) => (
                            <div
                                key={exp.id || index}
                                className="border-b border-border/50 pb-5 last:border-0"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-md font-semibold text-foreground">
                                            {exp.position}
                                        </h3>
                                        <div className="flex items-center text-muted-foreground mt-1">
                                            <Building className="h-4 w-4 mr-1" />
                                            <span>{exp.company}</span>
                                        </div>
                                        {exp.location && (
                                            <div className="flex items-center text-muted-foreground/80 mt-1 text-sm">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span>{exp.location}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-1 md:mt-0 flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span>
                                            {exp.startDate} -{' '}
                                            {exp.isCurrent
                                                ? 'Present'
                                                : exp.endDate}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-foreground/90 whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-gray-500">
                        <Building className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p>No work experience added yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ExperienceSection
