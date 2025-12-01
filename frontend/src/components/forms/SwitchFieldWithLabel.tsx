import { useField } from 'formik'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const SwitchFieldWithLabel = ({ label, ...props }) => {
    const [field, meta, helpers] = useField({ ...props, type: 'checkbox' })

    return (
        <div className="flex items-center space-x-2 mb-4">
            <Switch
                id={props.name}
                checked={field.value}
                onCheckedChange={(checked) => {
                    helpers.setValue(checked)
                    helpers.setTouched(true)
                }}
                disabled={props.disabled}
            />
            <div className="grid gap-1.5 leading-none">
                <Label
                    htmlFor={props.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {label}
                </Label>
                {props.description && (
                    <p className="text-sm text-muted-foreground">
                        {props.description}
                    </p>
                )}
                {meta.touched && meta.error && (
                    <p className="text-sm text-red-600">{meta.error}</p>
                )}
            </div>
        </div>
    )
}

export default SwitchFieldWithLabel
