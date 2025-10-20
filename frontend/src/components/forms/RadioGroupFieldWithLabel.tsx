import React from 'react'
import { useField, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type RadioOption = {
    value: string
    label: string
}

type RadioGroupFieldWithLabelProps = {
    name: string
    label: string
    options: RadioOption[]
    className?: string
    disabled?: boolean
    required?: boolean
    orientation?: 'horizontal' | 'vertical'
} & (
    | { formik: true }
    | {
          formik?: false
          value: string
          onChange: (value: string) => void
          onBlur?: () => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const RadioGroupFieldWithLabel: React.FC<RadioGroupFieldWithLabelProps> = (
    props
) => {
    const {
        label,
        name,
        options,
        className = '',
        disabled = false,
        required = false,
        orientation = 'vertical',
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
                    <Label className="block text-sm font-medium mb-2">
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                    <RadioGroup
                        value={field.value || ''}
                        onValueChange={(value) => {
                            formik.setFieldValue(name, value)
                            formik.setFieldTouched(name, true)
                        }}
                        disabled={disabled}
                        className={`${
                            orientation === 'horizontal'
                                ? 'flex flex-row gap-4'
                                : 'flex flex-col space-y-2'
                        } ${className}`}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={option.value}
                                    id={`${name}-${option.value}`}
                                />
                                <Label
                                    htmlFor={`${name}-${option.value}`}
                                    className="text-sm font-normal"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
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
                `RadioGroupField with name "${name}" is marked as a Formik field but no Formik context was found.`
            )
            return (
                <div className="mb-4">
                    <Label className="block text-sm font-medium mb-2">
                        {label}{' '}
                        {required && <span className="text-red-500">*</span>}
                    </Label>
                    <RadioGroup
                        disabled={disabled}
                        className={`${
                            orientation === 'horizontal'
                                ? 'flex flex-row gap-4'
                                : 'flex flex-col space-y-2'
                        } ${className}`}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={option.value}
                                    id={`${name}-${option.value}`}
                                />
                                <Label
                                    htmlFor={`${name}-${option.value}`}
                                    className="text-sm font-normal"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )
        }
    } else {
        // Non-Formik version
        const { value, onChange, onBlur, errors } = props
        const hasError = errors && errors[name]

        return (
            <div className="mb-4">
                <Label className="block text-sm font-medium mb-2">
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </Label>
                <RadioGroup
                    value={value}
                    onValueChange={(newValue) => {
                        onChange(newValue)
                        if (onBlur) onBlur()
                    }}
                    disabled={disabled}
                    className={`${
                        orientation === 'horizontal'
                            ? 'flex flex-row gap-4'
                            : 'flex flex-col space-y-2'
                    } ${className}`}
                >
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center space-x-2"
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`${name}-${option.value}`}
                            />
                            <Label
                                htmlFor={`${name}-${option.value}`}
                                className="text-sm font-normal"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
                {hasError && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors[name]?.message}
                    </p>
                )}
            </div>
        )
    }
}

export default RadioGroupFieldWithLabel
