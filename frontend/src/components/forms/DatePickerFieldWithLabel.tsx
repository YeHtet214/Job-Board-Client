import React, { useState, useRef, useEffect } from 'react'
import { useField } from 'formik'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, parse } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '../ui/calendar'

interface DatePickerFieldWithLabelProps {
    name: string
    label: string
    placeholder?: string
    className?: string
    disabled?: boolean
    required?: boolean
    dateFormat?: string
}

const DatePickerFieldWithLabel: React.FC<DatePickerFieldWithLabelProps> = ({
    name,
    label,
    placeholder = 'Pick a date',
    className = '',
    disabled = false,
    required = false,
    dateFormat = 'PPP',
}) => {
    const [field, meta, helpers] = useField<Date | null>(name)
    const [isOpen, setIsOpen] = useState(false)
    const [displayValue, setDisplayValue] = useState('')
    const datePickerRef = useRef<HTMLDivElement>(null)

    const hasError = meta.touched && meta.error
    const dateValue = field.value
        ? field.value instanceof Date
            ? field.value
            : new Date(field.value)
        : null

    // Update display value when date changes
    useEffect(() => {
        if (dateValue && !isNaN(dateValue.getTime())) {
            setDisplayValue(format(dateValue, dateFormat))
        } else {
            setDisplayValue('')
        }
    }, [dateValue, dateFormat])

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleDateChange = (date: Date | null) => {
        if (date && !isNaN(date.getTime())) {
            helpers.setValue(date)
            helpers.setTouched(true)
        }
    }

    return (
        <div className="mb-4 relative" ref={datePickerRef}>
            <Label
                htmlFor={name}
                className="block text-sm font-medium mb-1 text-jb-text-muted-foreground"
            >
                {label} {required && <span className="text-jb-danger">*</span>}
            </Label>

            <div className="relative">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !displayValue && 'text-muted-foreground',
                        hasError && 'border-red-500',
                        className
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {displayValue || <span>{placeholder}</span>}
                </Button>

                {isOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-jb-bg border rounded-md shadow-lg p-2">
                        <Calendar
                            mode="single"
                            initialFocus
                            selected={dateValue || undefined}
                            onSelect={(date) => handleDateChange(date || null)}
                            disabled={disabled}
                        />
                    </div>
                )}
            </div>

            {hasError && (
                <p className="mt-1 text-sm text-red-600">{meta.error}</p>
            )}
        </div>
    )
}

export default DatePickerFieldWithLabel
