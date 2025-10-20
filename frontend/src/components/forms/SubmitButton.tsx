import React from 'react'
import { useFormikContext } from 'formik'

type SubmitButtonProps = {
    children: React.ReactNode
    className?: string
    isSubmitting?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
    children,
    className = '',
    isSubmitting: externalIsSubmitting,
    disabled: externalDisabled,
    type = 'submit',
}) => {
    // Try to get Formik context (if available)
    const formik = useFormikContext()

    // Use Formik's isSubmitting if available, otherwise use the prop
    const isSubmitting = formik ? formik.isSubmitting : externalIsSubmitting

    // Button is disabled if explicitly disabled or if form is submitting
    const disabled = externalDisabled || isSubmitting

    return (
        <button
            type={type}
            disabled={disabled}
            className={`w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${className}`}
        >
            {isSubmitting ? (
                <span className="flex items-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                children
            )}
        </button>
    )
}

export default SubmitButton
