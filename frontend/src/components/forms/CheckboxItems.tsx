import { Field, useField } from "formik"
import { Label } from "../ui/label"

const jobTypeOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
]

const CheckboxItems = ({ ...props }) => {
  const [field, meta] = useField(props)

  return (
    <>
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        Job Type
      </Label>

      <div className="space-y-2">
        {jobTypeOptions.map((option) => (
          <Label key={option.value}>
            <Field {...field} {...props} type="checkbox" value={option.value} />
            {option.label}
          </Label>
        ))}
      </div>
      {meta.error && meta.touched && <p className="text-jb-red">{meta.error}</p>}
    </>
  )
}

export default CheckboxItems