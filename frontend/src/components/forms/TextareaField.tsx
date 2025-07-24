import React, { ReactNode } from 'react';
import { useField } from 'formik';
import { Label } from '@radix-ui/react-label';

type TextareaFieldProps = {
  name: string;
  label: ReactNode; // Accepts both string and JSX/HTML content
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
} & (
    | { formik: true }
    | {
      formik?: false;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
      onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
      errors?: Record<string, { message: string }> | undefined;
    }
  );

const TextareaField: React.FC<TextareaFieldProps> = (props) => {
  const {
    label,
    name,
    placeholder = '',
    className = '',
    rows = 4,
    disabled = false,
    required = false,
  } = props;

  // Handle both Formik and non-Formik usage
  if ('formik' in props && props.formik) {
    // Formik version
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium mb-1 text-jb-text-muted-foreground">
          {label} {required && <span className="text-jb-danger">*</span>}
        </label>
        <textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`mt-1 block w-full px-3 py-2 border ${hasError ? 'border-jb-danger' : 'border-jb-border'
            } rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary ${className}`}
          {...field}
        />
        {hasError && <p className="mt-1 text-sm text-jb-danger">{meta.error}</p>}
      </div>
    );
  } else {
    // Non-Formik version
    const { value, onChange, onBlur, errors } = props;
    const hasError = errors && errors[name];

    return (
      <div className="mb-4">
        <Label htmlFor={name} className="block text-sm font-medium mb-1 text-jb-text-muted-foreground">
          {label} {required && <span className="text-jb-danger">*</span>}
        </Label>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          disabled={disabled}
          className={`mt-1 block w-full px-3 py-2 border ${hasError ? 'border-jb-danger' : 'border-jb-border'
            } rounded-md shadow-sm focus:outline-none focus:ring-jb-primary focus:border-jb-primary ${className}`}
        />
        {hasError && <p className="mt-1 text-sm text-jb-danger">{errors[name]?.message}</p>}
      </div>
    );
  }
};

export default TextareaField;
