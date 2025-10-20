import React from 'react'
import { Form as FormikForm, FormikContext } from 'formik'

type FormProps = {
    children: React.ReactNode
    onSubmit?: (e?: React.FormEvent<HTMLFormElement>) => void
    className?: string
}

const Form: React.FC<FormProps> = ({ children, onSubmit, className = '' }) => {
    // Check if we're inside a Formik context
    const formikContext = React.useContext(FormikContext)
    const isFormikForm = formikContext !== undefined

    if (isFormikForm) {
        return (
            <FormikForm className={`space-y-4 ${className}`}>
                {children}
            </FormikForm>
        )
    }

    return (
        <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
            {children}
        </form>
    )
}

export default Form
