import ApplicationCard from "@/components/application/ApplicationCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/authContext";
import { useMyApplications } from "@/hooks/react-queries/application/useApplicationQueries";
import { Application } from "@/types/application";
import { useEffect } from "react";

const ApplicationListPage = () => {
    const { currentUser } = useAuth();
    const { data: applications, isLoading } = useMyApplications(currentUser?.id || "");

    useEffect(() => {
        console.log("Applications: ", applications);
    }, [applications])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-8">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center">
                <h1 className="text-3xl font-bold text-jobboard-darkblue">Applications</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                { applications && applications.length > 0 ? (
                    applications.map((application: Application) => (
                        <ApplicationCard key={application.id} application={application} />
                    ))
                ) : (
                    <p>No applications found</p>
                )}
            </div>
        </div>
    )
}

export default ApplicationListPage;
