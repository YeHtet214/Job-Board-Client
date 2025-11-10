import * as Yup from 'yup'
import { isValidDate, isNotInFuture, isBeforeEndDate } from '@/lib/date'

/**
 * Education item validation schema
 */
export const EducationSchema = Yup.object().shape({
    institution: Yup.string()
        .required('Institution is required')
        .max(100, 'Institution name is too long'),

    degree: Yup.string()
        .required('Degree is required')
        .max(100, 'Degree name is too long'),

    fieldOfStudy: Yup.string()
        .required('Field of study is required')
        .max(100, 'Field of study is too long'),

    startDate: Yup.string()
        .required('Start date is required')
        .test('is-valid-date', 'Invalid date format', isValidDate)
        .test(
            'not-in-future',
            'Start date cannot be in the future',
            isNotInFuture
        ),

    isCurrent: Yup.boolean().default(false),

    endDate: Yup.string().when(['isCurrent', 'startDate'], {
        is: (isCurrent: boolean) => !isCurrent,
        then: (schema) =>
            schema
                .required('End date is required')
                .test('is-valid-date', 'Invalid date format', isValidDate)
                .test(
                    'not-in-future',
                    'End date cannot be in the future',
                    isNotInFuture
                )
                .test(
                    'is-after-start-date',
                    'End date must be after start date',
                    function (endDate) {
                        const { startDate } = this.parent
                        return isBeforeEndDate(startDate, endDate)
                    }
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
})

/**
 * Experience item validation schema
 */
export const ExperienceSchema = Yup.object().shape({
    company: Yup.string()
        .required('Company is required')
        .max(100, 'Company name is too long'),

    position: Yup.string()
        .required('Position is required')
        .max(100, 'Position title is too long'),

    description: Yup.string()
        .required('Description is required')
        .min(20, 'Description should be at least 20 characters')
        .max(1000, 'Description should not exceed 1000 characters'),

    startDate: Yup.string()
        .required('Start date is required')
        .test('is-valid-date', 'Invalid date format', isValidDate)
        .test(
            'not-in-future',
            'Start date cannot be in the future',
            isNotInFuture
        ),

    isCurrent: Yup.boolean().default(false),

    endDate: Yup.string().when(['isCurrent', 'startDate'], {
        is: (isCurrent: boolean) => !isCurrent,
        then: (schema) =>
            schema
                .required('End date is required')
                .test('is-valid-date', 'Invalid date format', isValidDate)
                .test(
                    'not-in-future',
                    'End date cannot be in the future',
                    isNotInFuture
                )
                .test(
                    'is-after-start-date',
                    'End date must be after start date',
                    function (endDate) {
                        const { startDate } = this.parent
                        return isBeforeEndDate(startDate, endDate)
                    }
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
})

/**
 * URL validation schemas for social and portfolio links
 */
export const LinkedInUrlSchema = Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .test('is-valid-linkedin', 'Invalid LinkedIn URL', function (value) {
        if (!value) return true // Allow empty
        return /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(value)
    })

export const GitHubUrlSchema = Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .test('is-valid-github', 'Invalid GitHub URL', function (value) {
        if (!value) return true // Allow empty
        return /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/.test(value)
    })

export const WebUrlSchema = Yup.string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .url('Must be a valid URL')

/**
 * Complete profile validation schema
 */
export const ProfileValidationSchema = Yup.object().shape({
    bio: Yup.string()
        .required('Bio is required')
        .min(50, 'Bio should be at least 50 characters')
        .max(500, 'Bio should not exceed 500 characters'),

    skills: Yup.array()
        .of(Yup.string().required())
        .min(1, 'Add at least one skill')
        .max(20, 'You can add up to 20 skills'),

    education: Yup.array().of(EducationSchema),
    experience: Yup.array().of(ExperienceSchema),

    linkedInUrl: LinkedInUrlSchema,
    githubUrl: GitHubUrlSchema,
    portfolioUrl: WebUrlSchema,

    resumeUrl: Yup.string().nullable(),
})

export default ProfileValidationSchema
