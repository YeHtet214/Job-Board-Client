import { InputFieldWithLabel } from '../forms'

const PersonalInfoTab = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <p className="text-sm text-gray-500">
                Please provide your contact information below.
            </p>

            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="grid gap-2">
                        <InputFieldWithLabel
                            name="fullName"
                            label="Full Name"
                            required={true}
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <InputFieldWithLabel
                            name="email"
                            label="Email Address"
                            required={true}
                            placeholder="Enter your email address"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="phone"
                        label="Phone Number"
                        required={true}
                        placeholder="Enter your phone number"
                    />
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoTab
