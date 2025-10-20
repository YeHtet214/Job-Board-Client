import React from 'react'
import { useField, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type SwitchFieldWithLabelProps = {
    name: string
    label: string
    description?: string
    className?: string
    disabled?: boolean
} & (
    | { formik: true }
    | {
          formik?: false
          checked: boolean
          onChange: (checked: boolean) => void
          onBlur?: () => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const SwitchFieldWithLabel: React.FC<SwitchFieldWithLabelProps> = (props) => {
    const { label, name, description, className = '', disabled = false } = props

    // Handle both Formik and non-Formik usage
    if ('formik' in props && props.formik) {
        // Check if we're inside a Formik context
        const formik = useFormikContext()

        if (formik) {
            // Formik version
            const [field, meta] = useField({ name, type: 'checkbox' })
            const hasError = meta.touched && meta.error

            return (
                <div
                    className={`flex items-center space-x-2 mb-4 ${className}`}
                >
                    <Switch
                        id={name}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                            formik.setFieldValue(name, checked)
                            formik.setFieldTouched(name, true)
                        }}
                        disabled={disabled}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor={name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {label}
                        </Label>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                        {hasError && (
                            <p className="text-sm text-red-600">{meta.error}</p>
                        )}
                    </div>
                </div>
            )
        } else {
            // Fallback for when formik context is missing
            console.warn(
                `SwitchField with name "${name}" is marked as a Formik field but no Formik context was found.`
            )
            return (
                <div
                    className={`flex items-center space-x-2 mb-4 ${className}`}
                >
                    <Switch id={name} disabled={disabled} />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor={name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {label}
                        </Label>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )
        }
    } else {
        // Non-Formik version
        const { checked, onChange, onBlur, errors } = props
        const hasError = errors && errors[name]

        return (
            <div className={`flex items-center space-x-2 mb-4 ${className}`}>
                <Switch
                    id={name}
                    checked={checked}
                    onCheckedChange={(checked) => {
                        onChange(checked)
                        if (onBlur) onBlur()
                    }}
                    disabled={disabled}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </Label>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {hasError && (
                        <p className="text-sm text-red-600">
                            {errors[name]?.message}
                        </p>
                    )}
                </div>
            </div>
        )
    }
}

export default SwitchFieldWithLabel
