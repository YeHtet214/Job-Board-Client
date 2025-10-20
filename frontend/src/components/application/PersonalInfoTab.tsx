import React from 'react'
import { InputFieldWithLabel } from '../forms'

const PersonalInfoTab: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <p className="text-sm text-gray-500">
                Please provide your contact information below.
            </p>

            <div className="grid gap-4 py-4">
                {/* Full Name */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="fullName"
                        label="Full Name"
                        required={true}
                        formik={true}
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="email"
                        label="Email Address"
                        required={true}
                        formik={true}
                        placeholder="Enter your email address"
                    />
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                    <InputFieldWithLabel
                        name="phone"
                        label="Phone Number"
                        required={true}
                        formik={true}
                        placeholder="Enter your phone number"
                    />
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoTab
