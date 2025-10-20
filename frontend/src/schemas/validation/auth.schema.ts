import * as Yup from 'yup'

/**
 * Password regex pattern
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
 */
export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

/**
 * Registration validation schema
 * Ensures users provide all required information when registering
 */
export const RegisterSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: Yup.string()
        .matches(
            passwordRegex,
            'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
        )
        .required('Password is required'),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),

    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),

    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),

    role: Yup.string()
        .oneOf(['JOBSEEKER', 'EMPLOYER'], 'Please select a valid role')
        .required('Please select your role'),
})

/**
 * Login validation schema
 * Validates login credentials
 */
export const LoginSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    password: Yup.string().required('Password is required'),

    remember: Yup.boolean(),
})

/**
 * Forgot password validation schema
 */
export const ForgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
})

export default {
    RegisterSchema,
    LoginSchema,
    ForgotPasswordSchema,
    passwordRegex,
}
