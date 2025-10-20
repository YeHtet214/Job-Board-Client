import { MapPin, Globe, Calendar, Users } from 'lucide-react'
import { InputFieldWithLabel, SelectFieldWithLabel } from '../forms'

// Company size options
const sizeOptions = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1001-5000 employees',
    '5000+ employees',
].map((size) => ({ value: size, label: size }))

const CompanyDetailsTab = () => {
    return (
        <div className="space-y-6">
            <InputFieldWithLabel
                formik={true}
                name="location"
                label={
                    <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                    </span>
                }
                placeholder="City, State, Country"
                required
            />

            <InputFieldWithLabel
                formik={true}
                name="website"
                label={
                    <span className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                    </span>
                }
                placeholder="https://yourcompany.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputFieldWithLabel
                    formik={true}
                    name="foundedYear"
                    label={
                        <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Founded Year
                        </span>
                    }
                    placeholder="e.g. 2010"
                    required
                />

                <SelectFieldWithLabel
                    formik={true}
                    name="size"
                    label={
                        <span className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Company Size
                        </span>
                    }
                    options={sizeOptions}
                    placeholder="Select company size"
                />
            </div>
        </div>
    )
}

export default CompanyDetailsTab
