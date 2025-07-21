
import { Link } from "react-router-dom";
import { Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/admin/students">
            <Users className="mr-2 h-4 w-4" />
            Manage Students
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/formations">
            <GraduationCap className="mr-2 h-4 w-4" />
            Manage Formations
          </Link>
        </Button>
      </div>
    </div>
  );
};
