import { useAuth } from '@/contexts/authContext'
import JobSeekerDashboard from '@/components/jobseeker/JobSeekerDashboard'
import EmployerDashboard from '@/components/employer/EmployerDashboard'

const DashboardPage = () => {
    const { currentUser } = useAuth()

    console.log("Current User", currentUser)

    // If the user doesn't have a valid role
    if (
        !currentUser ||
        (currentUser.role !== 'JOBSEEKER' && currentUser.role !== 'EMPLOYER')
    ) {
        return (
            <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
                <h1 className="text-3xl font-bold mb-8 text-jb-primary">
                    Dashboard
                </h1>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                    <h2 className="text-xl font-semibold text-yellow-700 mb-2">
                        Account setup required
                    </h2>
                    <p className="text-yellow-600">
                        Please complete your account setup to access the
                        dashboard features.
                    </p>
                </div>
            </div>
        )
    }

    // Return appropriate dashboard based on user role
    return (
        <>
            {currentUser.role === 'JOBSEEKER' ? (
                <JobSeekerDashboard />
            ) : (
                <EmployerDashboard />
            )}
        </>
    )
}

export default DashboardPage
