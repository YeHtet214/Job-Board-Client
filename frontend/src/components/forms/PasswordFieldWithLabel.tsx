import React, { useState } from 'react'
import { useField, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

type PasswordFieldWithLabelProps = {
    name: string
    label: string
    placeholder?: string
    className?: string
    disabled?: boolean
    autoComplete?: string
    required?: boolean
    showToggle?: boolean
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

const PasswordFieldWithLabel: React.FC<PasswordFieldWithLabelProps> = (
    props
) => {
    const {
        label,
        name,
        placeholder = '',
        className = '',
        disabled = false,
        autoComplete = 'current-password',
        required = false,
        showToggle = true,
    } = props

    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

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
                        className="block text-sm font-medium mb-1"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete={autoComplete}
                            className={`pr-10 ${hasError ? 'border-red-500' : 'border-gray-300'} ${className}`}
                            {...field}
                        />
                        {showToggle && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={togglePasswordVisibility}
                                className="absolute right-0 top-0 h-full px-3 py-2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                                <span className="sr-only">
                                    {showPassword
                                        ? 'Hide password'
                                        : 'Show password'}
                                </span>
                            </Button>
                        )}
                    </div>
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
                `PasswordField with name "${name}" is marked as a Formik field but no Formik context was found.`
            )
            return (
                <div className="mb-4">
                    <Label
                        htmlFor={name}
                        className="block text-sm font-medium mb-1"
                    >
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                        <Input
                            type="password"
                            id={name}
                            name={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete={autoComplete}
                            className={className}
                        />
                    </div>
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
                    className="block text-sm font-medium mb-1"
                >
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative">
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`pr-10 ${hasError ? 'border-red-500' : 'border-gray-300'} ${className}`}
                    />
                    {showToggle && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={togglePasswordVisibility}
                            className="absolute right-0 top-0 h-full px-3 py-2"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="sr-only">
                                {showPassword
                                    ? 'Hide password'
                                    : 'Show password'}
                            </span>
                        </Button>
                    )}
                </div>
                {hasError && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors[name]?.message}
                    </p>
                )}
            </div>
        )
    }
}

export default PasswordFieldWithLabel
