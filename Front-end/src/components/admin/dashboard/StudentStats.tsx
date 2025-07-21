
import { Users, GraduationCap, UserX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StudentStatsProps = {
  activeStudents: number;
  graduatedStudents: number;
  droppedStudents: number;
};

export const StudentStats = ({
  activeStudents,
  graduatedStudents,
  droppedStudents,
}: StudentStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Status</CardTitle>
        <CardDescription>
          Overview of student enrollment and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold">{activeStudents}</p>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                Active Students
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold">{graduatedStudents}</p>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                Graduated
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                  <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-3xl font-bold">{droppedStudents}</p>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                Dropped Out
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
