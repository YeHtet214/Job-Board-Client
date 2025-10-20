import React from 'react'
import { useField, useFormikContext } from 'formik'

type Option = {
    value: string
    label: string
}

type SelectFieldProps = {
    name: string
    label: string
    options: Option[]
    placeholder?: string
    className?: string
    disabled?: boolean
    required?: boolean
} & (
    | { formik: true }
    | {
          formik?: false
          value: string
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
          onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const SelectField: React.FC<SelectFieldProps> = (props) => {
    const {
        label,
        name,
        options,
        placeholder,
        className = '',
        disabled = false,
        required = false,
    } = props

    // Handle both Formik and non-Formik usage
    if ('formik' in props && props.formik) {
        const formik = useFormikContext()
        // Formik version

        if (formik) {
            const [field, meta] = useField(name)
            const hasError = meta.touched && meta.error

            return (
                <div className="mb-4">
                    <label
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                        id={name}
                        disabled={disabled}
                        className={`mt-1 block w-full px-3 py-2 border ${
                            hasError ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                        {...field}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {hasError && (
                        <p className="mt-1 text-sm text-red-600">
                            {meta.error}
                        </p>
                    )}
                </div>
            )
        } else {
            // Fallback for when formik context is missing
            console.warn(
                `InputField with name "${name}" is marked as a Formik field but no Formik context was found.`
            )
            return (
                <div className="mb-4">
                    <label
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    <select
                        id={name}
                        disabled={disabled}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
    } else {
        // Non-Formik version
        const { value, onChange, onBlur, errors } = props
        const hasError = errors && errors[name]

        return (
            <div className="mb-4">
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={`mt-1 block w-full px-3 py-2 border ${
                        hasError ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {hasError && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors[name]?.message}
                    </p>
                )}
            </div>
        )
    }
}

export default SelectField
