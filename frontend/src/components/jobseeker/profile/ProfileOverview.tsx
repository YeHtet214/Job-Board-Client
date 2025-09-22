import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, PlusCircle, ArrowRight } from 'lucide-react';

interface ProfileOverviewProps {
  enterEditMode: () => void;
}

const ProfileOverview = ({ enterEditMode }: ProfileOverviewProps) => {
  return (
    <Card className="border shadow-md bg-jb-surface pt-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-jb-primary/10 to-jb-primary/10 py-4">
        <CardTitle className="text-2xl text-jb-text ">Create Your Professional Profile</CardTitle>
        <CardDescription className="text-jb-text-muted text-sm">
          Complete your profile to increase your chances of landing the perfect job
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 bg-jobboard-purple/10 rounded-full flex items-center justify-center">
              <User className="h-24 w-24 text-jobboard-purple/60" />
            </div>
          </div>
          <div className="lg:w-2/3 text-center lg:text-left">
            <h3 className="text-xl font-semibold mb-3 text-jb-text">Why Complete Your Profile?</h3>
            <ul className="space-y-3 mb-6 text-jb-text-muted">
              <li className="flex items-start">
                <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                <span>Showcase your skills and experience to potential employers</span>
              </li>
              <li className="flex items-start">
                <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                <span>Get matched with jobs that align with your qualifications</span>
              </li>
              <li className="flex items-start">
                <PlusCircle className="h-5 w-5 mr-2 text-jobboard-purple mt-0.5 flex-shrink-0" />
                <span>Stand out from other candidates with a comprehensive profile</span>
              </li>
            </ul>

            <Button
              onClick={enterEditMode}
              className="mt-4 bg-jb-primary hover:bg-jb-primary/80 text-white px-8 py-2 h-auto"
            >
              <span className="mr-2">Create Profile</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
