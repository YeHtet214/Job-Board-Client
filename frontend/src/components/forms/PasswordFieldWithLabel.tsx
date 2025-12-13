import { useState } from 'react'
import { useField } from 'formik'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { FormFieldProps } from '@/types/formFields'

const PasswordFieldWithLabel = ({ label, ...props }: Partial<FormFieldProps>) => {
    const [field, meta] = useField(props);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Label>{label}</Label>
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    {...field}
                    className={`${meta.touched && meta.error ? 'border-jb-danger' : ''}`}
                    placeholder='Enter your password'
                />
                {showPassword ?
                    <Eye className="h-4 w-4 text-gray-500 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2" onClick={togglePasswordVisibility} /> :
                    <EyeOff className="h-4 w-4 text-gray-500 cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2" onClick={togglePasswordVisibility} />
                }
            </div>
            {meta.touched && meta.error && <p className="text-jb-danger">${meta.error}</p>}
        </>
    )
}

export default PasswordFieldWithLabel
