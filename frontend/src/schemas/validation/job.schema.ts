import * as Yup from 'yup'

/**
 * Job posting validation schema
 * Ensures job postings have all required fields and appropriate data
 */
export const JobSchema = Yup.object().shape({
    title: Yup.string()
        .min(5, 'Title is too short')
        .max(100, 'Title is too long')
        .required('Job title is required'),

    description: Yup.string()
        .min(50, 'Description must be at least 50 characters')
        .max(5000, 'Description is too long')
        .required('Job description is required'),

    location: Yup.string().required('Job location is required'),

    type: Yup.string()
        .oneOf(['FULL_TIME', 'PART_TIME', 'CONTRACT'], 'Invalid job type')
        .required('Job type is required'),

    salaryMin: Yup.number()
        .min(0, 'Minimum salary cannot be negative')
        .required('Minimum salary is required'),

    salaryMax: Yup.number()
        .min(0, 'Maximum salary cannot be negative')
        .moreThan(
            Yup.ref('salaryMin'),
            'Maximum salary must be greater than minimum salary'
        )
        .required('Maximum salary is required'),

    requiredSkills: Yup.array()
        .min(1, 'At least one required skill is needed')
        .required('Required skills are needed'),

    experienceLevel: Yup.string().required('Experience level is required'),

    expiresAt: Yup.date()
        .min(new Date(), 'Expiry date cannot be in the past')
        .required('Expiry date is required'),
})

export const JobFilterSchema = Yup.object().shape({
    keyword: Yup.string().optional(),
    location: Yup.string().optional(),
    jobTypes: Yup.array().of(Yup.string()).optional(),
    experienceLevel: Yup.string().optional(),
})

export default JobSchema
