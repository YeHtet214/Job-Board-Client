import { InputFieldWithLabel, TextareaField } from '../forms'

const QuestionsTab = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Questions</h3>
            <p className="text-sm text-gray-500">
                Please answer these additional questions from the employer.
            </p>

            <div className="grid gap-6 py-4">
                {/* Availability */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="availability"
                        label="When can you start?"
                        required={true}
                        formik={true}
                        placeholder="e.g., Immediately, 2 weeks, after June 15th, etc."
                    />
                </div>

                {/* Expected Salary */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="expectedSalary"
                        label="What is your expected salary?"
                        required={true}
                        formik={true}
                        placeholder="e.g., $70,000 - $80,000 per year"
                    />
                </div>

                {/* Additional Information */}
                <div className="grid gap-2">
                    <TextareaField
                        name="additionalInfo"
                        label="Anything else you'd like to share?"
                        placeholder="Share any additional information that might help your application..."
                        formik={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default QuestionsTab
