import * as Yup from 'yup'

const ApplicationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),

    resume: Yup.mixed().test(
        'fileRequired',
        'Please upload your resume or use existing one',
        function (value) {
            return this.parent.useExistingResume || value !== null
        }
    ),

    coverLetter: Yup.string().required('Cover letter is required'),

    availability: Yup.string().required('Please specify your availability'),
    expectedSalary: Yup.string().required('Expected salary is required'),

    acceptTerms: Yup.boolean().oneOf(
        [true],
        'You must accept the terms and conditions'
    ),
})

export default ApplicationSchema
