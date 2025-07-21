
import { UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type StatsCardsProps = {
  totalStudents: number;
  activeStudents: number;
  activeFormations: number;
  totalFormations: number;
  instructorsCount: number;
  specialistsCount: number;
  enrollmentRate: number;
};

export const StatsCards = ({
  totalStudents,
  activeStudents,
  activeFormations,
  totalFormations,
  instructorsCount,
  specialistsCount,
  enrollmentRate,
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Students</CardDescription>
          <CardTitle className="text-4xl font-bold">{totalStudents}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <UserCheck className="text-green-500 mr-1 h-4 w-4" />
              <span>Active: {activeStudents}</span>
            </div>
            <div className="flex items-center">
              <UserX className="text-red-500 mr-1 h-4 w-4" />
              <span>Inactive: {totalStudents - activeStudents}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Formations</CardDescription>
          <CardTitle className="text-4xl font-bold">{activeFormations}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-sm">
            <span>Out of {totalFormations} total formations</span>
            <Button asChild variant="ghost" className="p-0 h-auto">
              <Link to="/admin/formations">View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Instructors</CardDescription>
          <CardTitle className="text-4xl font-bold">{instructorsCount}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-sm">
            <span>{specialistsCount} specialists</span>
            <Button asChild variant="ghost" className="p-0 h-auto">
              <Link to="/admin/instructors">View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Enrollment Rate</CardDescription>
          <CardTitle className="text-4xl font-bold">{enrollmentRate}%</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={enrollmentRate} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};
