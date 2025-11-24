import React, { ReactNode } from 'react'
import { useField } from 'formik'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface TextareaFieldProps {
    name: string
    label: ReactNode
    placeholder?: string
    className?: string
    rows?: number
    disabled?: boolean
    required?: boolean
}

const TextareaField: React.FC<TextareaFieldProps> = ({
    label,
    name,
    placeholder = '',
    className = '',
    rows = 4,
    disabled = false,
    required = false,
}) => {
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
            <Textarea
                id={name}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`mt-1 block w-full ${hasError ? 'border-jb-danger' : 'border-jb-border'
                    } ${className}`}
                {...field}
            />
            {hasError && (
                <p className="mt-1 text-sm text-jb-danger">{meta.error}</p>
            )}
        </div>
    )
}

export default TextareaField
