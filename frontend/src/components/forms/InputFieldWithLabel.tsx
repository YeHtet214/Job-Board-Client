import React, { ReactNode } from 'react'
import { useField, useFormikContext } from 'formik'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type InputFieldWithLabelProps = {
    name: string
    label: ReactNode // Accepts both string and JSX/HTML content
    placeholder?: string
    className?: string
    disabled?: boolean
    autoComplete?: string
    required?: boolean
} & (
    | { formik: true }
    | {
          formik?: false
          value: string
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
          onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = (props) => {
    const {
        label,
        name,
        placeholder = '',
        className = '',
        disabled = false,
        autoComplete,
        required = false,
    } = props

    // Handle both Formik and non-Formik usage
    if ('formik' in props && props.formik) {
        // Check if we're inside a Formik context
        const formik = useFormikContext()

        if (formik) {
            // Formik version
            const [field, meta] = useField(name)
            const hasError = meta.touched && meta.error

            return (
                <div className="mb-4">
                    <Label
                        htmlFor={name}
                        className="block text-sm font-medium mb-1 text-jb-text-muted-foreground"
                    >
                        {label}{' '}
                        {required && <span className="text-jb-danger">*</span>}
                    </Label>
                    <Input
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={` block w-full px-3 py-4 border ${
                            hasError ? 'border-jb-danger' : 'border-jb-border'
                        } rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary ${className}`}
                        {...field}
                        {...props}
                    />
                    {hasError && (
                        <p className="mt-1 text-sm text-jb-danger">
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
                    <Label
                        htmlFor={name}
                        className="block text-sm font-medium mb-2 text-muted-foreground"
                    >
                        <div className="relative inline-block">
                            {label}{' '}
                            {required && (
                                <span className="text-jb-danger absolute -right-2 top-1/2 transform -translate-y-1/2">
                                    *
                                </span>
                            )}
                        </div>
                    </Label>
                    <Input
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={` block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary ${className}`}
                        {...props}
                    />
                </div>
            )
        }
    } else {
        // Non-Formik version
        const { value, onChange, onBlur, errors } = props
        const hasError = errors && errors[name]

        return (
            <div className="mb-4">
                <Label
                    htmlFor={name}
                    className="block text-sm font-medium mb-2 text-jb-text"
                >
                    <div className="relative inline-block">
                        {label}{' '}
                        {required && (
                            <span className="text-jb-danger absolute -right-2 top-1/2 transform -translate-y-1/2">
                                *
                            </span>
                        )}
                    </div>
                </Label>
                <Input
                    id={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`mt-1 block w-full px-3 py-4 border ${
                        hasError ? 'border-jb-danger' : 'border-jb-border'
                    } rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary ${className}`}
                />
                {hasError && (
                    <p className="mt-1 text-sm text-jb-danger">
                        {errors[name]?.message}
                    </p>
                )}
            </div>
        )
    }
}

export default InputFieldWithLabel
