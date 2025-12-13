import { useFormikContext } from 'formik'
import { Image } from 'lucide-react'
import { Label } from '../ui/label'
import { InputFieldWithLabel } from '../forms'
import { CreateCompanyDto } from '../../types/company'

const BrandingTab = () => {
    const { values } = useFormikContext<CreateCompanyDto>()

    return (
        <div className="space-y-6">
            <div>
                <InputFieldWithLabel
                    name="logo"
                    label={
                        <span className="flex items-center">
                            <Image className="h-4 w-4 mr-2" />
                            Logo URL
                        </span>
                    }
                    placeholder="https://example.com/your-logo.png"
                />
                <p className="text-sm text-gray-500 mt-2">
                    Please provide a URL to your company logo. For best results,
                    use a square image (recommended size: 300x300px).
                </p>
            </div>

            {values.logo && (
                <div className="mt-4">
                    <Label className="mb-2">Logo Preview</Label>
                    <div className="mt-2 rounded-md overflow-hidden border border-gray-200 w-32 h-32 flex items-center justify-center">
                        <img
                            src={values.logo}
                            alt="Company Logo Preview"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src =
                                    'https://via.placeholder.com/300?text=Invalid+Image'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrandingTab
