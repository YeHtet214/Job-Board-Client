import { Profile, Education, Experience } from '@/types/profile'

export const mapProfileData = (data: any): Profile => {
  if (!data) return data

  return {
    ...data,
    education: Array.isArray(data.education)
      ? data.education.map((edu: any) => mapEducation(edu))
      : [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp: any) => mapExperience(exp))
      : [],
  }
}

const mapEducation = (edu: any): Education => {
  return {
    id: edu.id,
    institution: edu.institution || edu.school,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy || edu.field_of_study,
    startDate: edu.startDate || edu.start_date || (edu.startYear ? String(edu.startYear) : undefined),
    endDate: edu.endDate || edu.end_date || (edu.endYear ? String(edu.endYear) : undefined),
    isCurrent: edu.isCurrent || edu.is_current,
    description: edu.description,
  }
}

const mapExperience = (exp: any): Experience => {
  return {
    id: exp.id,
    company: exp.company || exp.company_name,
    position: exp.position || exp.job_title || exp.title,
    location: exp.location,
    startDate: exp.startDate || exp.start_date || exp.start,
    endDate: exp.endDate || exp.end_date || exp.end,
    isCurrent: exp.isCurrent || exp.is_current,
    description: exp.description || (Array.isArray(exp.responsibilities) ? exp.responsibilities.join('\n') : exp.responsibilities),
  }
}
