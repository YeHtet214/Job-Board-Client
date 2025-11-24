import React from 'react'
import { useField } from 'formik'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface CheckboxFieldProps {
  name: string
  label: React.ReactNode
  description?: string
  className?: string
  disabled?: boolean
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  description,
  className = '',
  disabled = false,
}) => {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' })

  return (
    <div className={`${className}`}>
      <Label
        htmlFor={name}
        className="text-sm mb-3 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-1"
      >
        {label}
      </Label>
      <div className="flex gap-2 items-center leading-none">
        <Checkbox
          id={name}
          {...field}
          onCheckedChange={(checked) => {
            helpers.setValue(checked)
            helpers.setTouched(true)
          }}
          className="cursor-pointer"
          disabled={disabled}
        />
        {description}
      </div>
      {meta.touched && meta.error && (
        <p className="text-sm text-jb-danger">{meta.error}</p>
      )}
    </div>
  )
}

export default CheckboxField
