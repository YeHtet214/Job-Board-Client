import React, { useState, useRef } from 'react'
import { useField } from 'formik'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload, FileText, X } from 'lucide-react'

interface FileInputFieldWithLabelProps {
    name: string
    label: string
    accept?: string
    maxSize?: number // in bytes
    description?: string
    className?: string
    disabled?: boolean
    required?: boolean
    showPreview?: boolean
}

const FileInputFieldWithLabel: React.FC<FileInputFieldWithLabelProps> = ({
    label,
    name,
    accept = '*/*',
    maxSize = 5 * 1024 * 1024, // Default 5MB
    description,
    className = '',
    disabled = false,
    required = false,
    showPreview = true,
}) => {
    const [field, meta, helpers] = useField<File | null>(name)
    const [fileError, setFileError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            helpers.setValue(null)
            return
        }

        // Validate file size
        if (file.size > maxSize) {
            setFileError(
                `File size exceeds the ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`
            )
            helpers.setValue(null)
            return
        }

        // Validate file type if accept is specified
        if (accept !== '*/*') {
            const fileType = file.type
            const acceptedTypes = accept.split(',').map((type) => type.trim())

            let isValidType = false
            for (const type of acceptedTypes) {
                if (type.includes('/*')) {
                    const mainType = type.split('/')[0]
                    if (fileType.startsWith(mainType)) {
                        isValidType = true
                        break
                    }
                } else if (type === fileType) {
                    isValidType = true
                    break
                } else if (type.startsWith('.') && file.name.endsWith(type)) {
                    isValidType = true
                    break
                }
            }

            if (!isValidType) {
                setFileError(`Invalid file type. Accepted: ${accept}`)
                helpers.setValue(null)
                return
            }
        }

        setFileError(null)
        helpers.setValue(file)
        helpers.setTouched(true)
    }

    const clearFile = () => {
        helpers.setValue(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFileError(null)
    }

    const hasError = (meta.touched && meta.error) || fileError
    const errorMessage = fileError || meta.error

    return (
        <div className={`mb-4 ${className}`}>
            <Label htmlFor={name} className="block text-sm font-medium mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            {description && (
                <p className="text-sm text-muted-foreground mb-2">
                    {description}
                </p>
            )}

            <div className="mt-1 flex items-center gap-2">
                <input
                    type="file"
                    id={name}
                    ref={fileInputRef}
                    accept={accept}
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="flex-none"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                </Button>

                {field.value && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={clearFile}
                        disabled={disabled}
                        className="p-1 h-auto"
                        size="sm"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </Button>
                )}
            </div>

            {field.value && showPreview && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm truncate max-w-xs">
                        {field.value.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({(field.value.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                </div>
            )}

            {hasError && (
                <div className="mt-1 flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    )
}

export default FileInputFieldWithLabel
