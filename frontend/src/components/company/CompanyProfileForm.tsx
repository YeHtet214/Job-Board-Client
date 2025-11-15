import { useState } from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { Info, Building, Image } from 'lucide-react'
import BasicInfoTab from './BasicInfoTab'
import CompanyDetailsTab from './CompanyDetailsTab'
import BrandingTab from './BrandingTab'
import LoadingSpinner from '../ui/LoadingSpinner'
import {
    CreateCompanyDto,
    Company,
    UpdateCompanyDto,
} from '../../types/company'
import {
    useCreateCompany,
    useUpdateCompany,
} from '../../hooks/react-queries/company'
import { useToast } from '../ui/use-toast'

// Set up validation schema using Yup
const CompanySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Company name is too short')
        .max(100, 'Company name is too long')
        .required('Company name is required'),
    description: Yup.string()
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description is too long')
        .required('Company description is required'),
    website: Yup.string().url('Please enter a valid URL').nullable(),
    location: Yup.string().required('Location is required'),
    industry: Yup.string().required('Industry is required'),
    foundedYear: Yup.number()
        .min(1800, 'Year must be after 1800')
        .max(new Date().getFullYear(), 'Year cannot be in the future')
        .nullable(),
    size: Yup.mixed<"1-10" | "11-50" | "51-200" | "201-500" | "500+">()
        .oneOf(["1-10", "11-50", "51-200", "201-500", "500+"]).nullable(),
    logo: Yup.string().url('Please enter a valid image URL').nullable(),
})

interface CompanyProfileFormProps {
    company: Company | null
    isNewCompany: boolean
}

const CompanyProfileForm = ({
    company,
    isNewCompany,
}: CompanyProfileFormProps) => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('basic-info')
    const { toast } = useToast()

    // Get mutation hooks
    const createCompany = useCreateCompany()
    const updateCompany = useUpdateCompany()

    // Get initial values based on existing company or default values
    const initialValues: CreateCompanyDto = {
        name: company?.name || '',
        description: company?.description || '',
        website: company?.website || '',
        location: company?.location || '',
        industry: company?.industry || '',
        foundedYear: company?.foundedYear || undefined,
        size: company?.size || '',
        logo: company?.logo || '',
    }

    // Handle form submission
    const handleSubmit = async (
        values: CreateCompanyDto | UpdateCompanyDto,
        formikHelpers: FormikHelpers<CreateCompanyDto>
    ) => {
        const { setSubmitting, validateForm } = formikHelpers

        try {
            // Explicitly validate the form
            const errors = await validateForm()

            // If there are validation errors, show a toast and highlight the fields
            if (Object.keys(errors).length > 0) {
                // Set the active tab to the one containing the first error
                if (errors.name || errors.description || errors.industry) {
                    setActiveTab('basic-info')
                } else if (
                    errors.location ||
                    errors.website ||
                    errors.foundedYear ||
                    errors.size
                ) {
                    setActiveTab('details')
                } else if (errors.logo) {
                    setActiveTab('branding')
                }

                // Create a more specific error message based on missing fields
                const missingFields = Object.keys(errors)
                    .map((key) => {
                        // Convert camelCase to readable format
                        const formatted = key
                            .replace(/([A-Z])/g, ' $1')
                            .toLowerCase()
                        return (
                            formatted.charAt(0).toUpperCase() +
                            formatted.slice(1)
                        )
                    })
                    .join(', ')

                toast({
                    title: 'Required Fields Missing',
                    description: `Please complete the following fields: ${missingFields}`,
                    variant: 'default',
                })

                return
            }

            if (company) {
                // Update existing company
                await updateCompany.mutateAsync({
                    id: company.id,
                    data: values as UpdateCompanyDto,
                })
                toast({
                    title: 'Success',
                    description:
                        'Company profile has been updated successfully.',
                    variant: 'success',
                })
                navigate('/dashboard')
            } else {
                // Create new company
                await createCompany.mutateAsync(values as CreateCompanyDto)
                toast({
                    title: 'Success',
                    description:
                        'Company profile has been created successfully.',
                })
                navigate('/dashboard')
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An error occurred while saving the company profile'

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isNewCompany ? 'New Company Profile' : 'Company Profile'}
                </CardTitle>
                <CardDescription>
                    {isNewCompany
                        ? 'Fill in your company details to get started'
                        : 'Update your company information visible to job seekers'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={CompanySchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ errors, isSubmitting }) => (
                        <Form>
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="grid grid-cols-3 mb-8">
                                    <TabsTrigger
                                        value="basic-info"
                                        className="text-base"
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">
                                            Basic Info
                                        </span>
                                        <span className="sm:hidden">Basic</span>
                                        {(errors.name ||
                                            errors.description ||
                                            errors.industry) && (
                                                <span className="ml-2 h-2 w-2 rounded-full bg-jb-text-primary"></span>
                                            )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="details"
                                        className="text-base"
                                    >
                                        <Building className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">
                                            Company Details
                                        </span>
                                        <span className="sm:hidden">
                                            Details
                                        </span>
                                        {(errors.location ||
                                            errors.website ||
                                            errors.foundedYear ||
                                            errors.size) && (
                                                <span className="ml-2 h-2 w-2 rounded-full bg-jb-text-primary"></span>
                                            )}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="branding"
                                        className="text-base"
                                    >
                                        <Image className="h-4 w-4 mr-2" />
                                        <span className="hidden sm:inline">
                                            Branding
                                        </span>
                                        <span className="sm:hidden">Brand</span>
                                        {errors.logo && (
                                            <span className="ml-2 h-2 w-2 rounded-full bg-jb-text-primary"></span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="basic-info"
                                    className="mt-0"
                                >
                                    <BasicInfoTab />
                                </TabsContent>

                                <TabsContent value="details" className="mt-0">
                                    <CompanyDetailsTab />
                                </TabsContent>

                                <TabsContent value="branding" className="mt-0">
                                    <BrandingTab />
                                </TabsContent>
                            </Tabs>

                            <div className="mt-8 flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-jb-primary text-white hover:bg-jb-primary/90"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner size="sm" />
                                    ) : isNewCompany ? (
                                        'Create Company'
                                    ) : (
                                        'Update Company'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    )
}

export default CompanyProfileForm
