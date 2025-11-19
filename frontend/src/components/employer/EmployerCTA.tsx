import { Building } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"
import { useMyCompany } from "@/hooks/react-queries/company"

const EmployerCTA = () => {
  const { currentUser } = useAuth()
  const isEmployer = currentUser?.role === 'EMPLOYER'
  const { data: userCompany } = isEmployer ? useMyCompany() : { data: null }

  return (
    <div className="mt-8 bg-gradient-to-r from-jb-primary to-jb-surface rounded-lg shadow-lg p-6 text-center">
      <Building className="h-12 w-12 mx-auto text-white mb-4" />
      <h2 className="text-xl font-bold text-white mb-3">
        Are You an Employer?
      </h2>
      <p className="text-white/80 mb-6 text-sm">
        {!isEmployer
          ? 'Create your company profile and start posting jobs to find the perfect candidates.'
          : userCompany
            ? 'Manage your company profile and continue posting jobs to find the perfect candidates.'
            : 'Create your company profile and start posting jobs to find the perfect candidates.'}
      </p>
      {!isEmployer ? (
        <Link to="/register?role=EMPLOYER">
          <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
            Register as Employer
          </Button>
        </Link>
      ) : userCompany ? (
        <Link to="/employer/company/profile">
          <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
            Manage Company Profile
          </Button>
        </Link>
      ) : (
        <Link to="/employer/company/profile">
          <Button className="bg-background text-jb-primary hover:bg-accent font-semibold w-full">
            Create Company Profile
          </Button>
        </Link>
      )}
    </div>
  )
}

export default EmployerCTA