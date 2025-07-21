
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grade } from "@/types";

interface GradeStatsProps {
  grades: Grade[];
}

export function GradeStats({ grades }: GradeStatsProps) {
  const averageGrade = grades?.length 
    ? Math.round(grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length) 
    : 0;

  const passingRate = grades?.length 
    ? Math.round((grades.filter(grade => grade.value >= 60).length / grades.length) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Average Grade</CardDescription>
          <CardTitle className="text-4xl font-bold">
            {averageGrade}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Across all courses and students
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Grades</CardDescription>
          <CardTitle className="text-4xl font-bold">
            {grades?.length || 0}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Recorded in the system
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Passing Rate</CardDescription>
          <CardTitle className="text-4xl font-bold">
            {passingRate}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Students with passing grades
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
