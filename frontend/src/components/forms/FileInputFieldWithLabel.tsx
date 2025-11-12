import React, { useState, useRef } from 'react'
import { useField, useFormikContext } from 'formik'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload, FileText, X } from 'lucide-react'

type FileInputFieldWithLabelProps = {
    name: string
    label: string
    accept?: string
    maxSize?: number // in bytes
    description?: string
    className?: string
    disabled?: boolean
    required?: boolean
    showPreview?: boolean
} & (
    | { formik: true }
    | {
          formik?: false
          value?: File | null
          onChange: (file: File | null) => void
          onBlur?: () => void
          errors?: Record<string, { message: string }> | undefined
      }
)

const FileInputFieldWithLabel: React.FC<FileInputFieldWithLabelProps> = (
    props
) => {
    const {
        label,
        name,
        accept = '*/*',
        maxSize = 5 * 1024 * 1024, // Default 5MB
        description,
        className = '',
        disabled = false,
        required = false,
        showPreview = true,
    } = props

    const [fileError, setFileError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formikContext = useFormikContext<any>()
    const [field, meta, helpers] = useField(name)

    const isFormikMode = 'formik' in props && props.formik && !!formikContext

    // Setup values based on mode
    const fileValue = isFormikMode
        ? field.value
        : props.formik === false
          ? props.value
          : null
    const hasError = isFormikMode
        ? (meta.touched && meta.error) || fileError
        : (props.formik === false && props.errors && props.errors[name]) ||
          fileError
    const errorMessage = isFormikMode
        ? fileError || meta.error
        : fileError ||
          (props.formik === false &&
              props.errors &&
              props.errors[name]?.message)

    // Handle file change for Formik mode
    const handleFormikFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

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
                const acceptedTypes = accept
                    .split(',')
                    .map((type) => type.trim())

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
                    } else if (
                        type.startsWith('.') &&
                        file.name.endsWith(type)
                    ) {
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
    }

    // Handle file change for non-Formik mode
    const handleNonFormikFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!('formik' in props) || props.formik === false) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]

                // Validate file size
                if (file.size > maxSize) {
                    setFileError(
                        `File size exceeds the ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`
                    )
                    props.onChange(null)
                    return
                }

                // Validate file type if accept is specified
                if (accept !== '*/*') {
                    const fileType = file.type
                    const acceptedTypes = accept
                        .split(',')
                        .map((type) => type.trim())

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
                        } else if (
                            type.startsWith('.') &&
                            file.name.endsWith(type)
                        ) {
                            isValidType = true
                            break
                        }
                    }

                    if (!isValidType) {
                        setFileError(`Invalid file type. Accepted: ${accept}`)
                        props.onChange(null)
                        return
                    }
                }

                setFileError(null)
                props.onChange(file)
                if (props.onBlur) props.onBlur()
            }
        }
    }

    // Single handler that delegates to the right implementation
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isFormikMode) {
            handleFormikFileChange(e)
        } else {
            handleNonFormikFileChange(e)
        }
    }

    // Clear file for Formik mode
    const clearFormikFile = () => {
        helpers.setValue(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        setFileError(null)
    }

    // Clear file for non-Formik mode
    const clearNonFormikFile = () => {
        if (!('formik' in props) || props.formik === false) {
            props.onChange(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            setFileError(null)
        }
    }

    // Single clear function that delegates to the right implementation
    const clearFile = () => {
        if (isFormikMode) {
            clearFormikFile()
        } else {
            clearNonFormikFile()
        }
    }

    // If Formik context not found but formik prop is true, show warning UI
    if ('formik' in props && props.formik && !formikContext) {
        console.warn(
            `FileInputField with name "${name}" is marked as a Formik field but no Formik context was found.`
        )
        return (
            <div className={`mb-4 ${className} !d-inline-block `}>
                <Label
                    htmlFor={name}
                    className="block text-sm font-medium mb-1"
                >
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </Label>

                {description && (
                    <p className="text-sm text-muted-foreground mb-2">
                        {description}
                    </p>
                )}

                <div className="mt-1">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className="flex-none border-2 !border-blue-500 !d-inline-block"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                    </Button>
                </div>
            </div>
        )
    }

    // Main UI render - unified for both modes
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

                {fileValue && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={clearFile}
                        disabled={disabled}
                        className="p-1 h-auto "
                        size="sm"
                    >
                        <X className="h-4 w-4 text-gray-500" />
                    </Button>
                )}
            </div>

            {fileValue && showPreview && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm truncate max-w-xs">
                        {fileValue.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        ({(fileValue.size / 1024 / 1024).toFixed(2)} MB)
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
