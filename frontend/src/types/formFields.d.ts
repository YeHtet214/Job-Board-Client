export interface FormFieldProps {
  label: string | React.ReactNode;
  name: string;
  options: { value: string, label: string }[];
  placeholder: string;
  description: string;
  autoComplete: string;
  disabled: boolean;
  required: boolean;
  className: string;
}
