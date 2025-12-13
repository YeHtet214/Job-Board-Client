import { useField } from "formik"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormFieldProps } from "@/types/formFields";

const InputFieldWithLabel = ({ label, ...props }: Partial<FormFieldProps>) => {
    const [field, meta] = useField(props);

    return (
        <>
            <Label>{label}</Label>
            <Input {...field} placeholder={props.placeholder} className={`${props.className} ${meta.touched && meta.error ? 'border-jb-danger' : ''}`} />
            {meta.touched && meta.error && <p className="text-jb-danger">${meta.error}</p>}
        </>
    )

}

export default InputFieldWithLabel