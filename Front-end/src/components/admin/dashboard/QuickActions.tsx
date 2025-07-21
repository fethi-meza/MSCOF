
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  BarChart3,
  Building2,
  UserCog
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button asChild className="w-full justify-start">
          <Link to="/admin/formations/new">
            <GraduationCap className="mr-2 h-4 w-4" />
            Add New Formation
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/admin/students">
            <Users className="mr-2 h-4 w-4" />
            View All Students
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/admin/courses">
            <BookOpen className="mr-2 h-4 w-4" />
            Manage Courses
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/admin/departments">
            <Building2 className="mr-2 h-4 w-4" />
            Manage Departments
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/admin/instructors">
            <UserCog className="mr-2 h-4 w-4" />
            Manage Instructors
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to="/admin/grades">
            <BarChart3 className="mr-2 h-4 w-4" />
            Grade Reports
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
