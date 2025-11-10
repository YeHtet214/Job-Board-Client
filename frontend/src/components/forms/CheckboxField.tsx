import React from 'react'
import { useField, useFormikContext } from 'formik'

type CheckboxFieldProps = {
    name: string
    label: React.ReactNode
    className?: string
    disabled?: boolean
    required?: boolean
} & (
    | { formik: true }
    | {
          formik?: false
          checked: boolean
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
          onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const CheckboxField: React.FC<CheckboxFieldProps> = (props) => {
    const {
        label,
        name,
        className = '',
        disabled = false,
        required = false,
    } = props

    // Handle both Formik and non-Formik usage
    if ('formik' in props && props.formik) {
        // Check if we're inside a Formik context
        const formik = useFormikContext()

        // If formik context exists, use useField
        if (formik) {
            const [field, meta] = useField({ name, type: 'checkbox' })
            const hasError = meta.touched && meta.error

            return (
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id={name}
                        disabled={disabled}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
                        {...field}
                    />
                    <label
                        htmlFor={name}
                        className="ml-2 block text-sm text-gray-700"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    {hasError && (
                        <p className="mt-1 text-sm text-red-600 ml-6">
                            {meta.error}
                        </p>
                    )}
                </div>
            )
        } else {
            // Fallback for when formik context is missing
            console.warn(
                `CheckboxField with name "${name}" is marked as a Formik field but no Formik context was found.`
            )
            return (
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        disabled={disabled}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
                    />
                    <label
                        htmlFor={name}
                        className="ml-2 block text-sm text-gray-700"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                </div>
            )
        }
    } else {
        // Non-Formik version
        const { checked, onChange, onBlur, errors } = props
        const hasError = errors && errors[name]

        return (
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id={name}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
                />
                <label
                    htmlFor={name}
                    className="ml-2 block text-sm text-gray-700"
                >
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {hasError && (
                    <p className="mt-1 text-sm text-red-600 ml-6">
                        {errors[name]?.message}
                    </p>
                )}
            </div>
        )
    }
}

export default CheckboxField
