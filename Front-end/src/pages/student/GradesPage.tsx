
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function GradesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "student") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const { data: grades, isLoading } = useQuery({
    queryKey: ["student-grades", user?.id],
    queryFn: async () => {
      const response = await api.get(`/students/${user?.id}/grades`);
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get grade letter
  const getGradeLetter = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  // Calculate GPA
  const calculateGPA = () => {
    if (!grades || grades.length === 0) return "N/A";
    
    const totalPoints = grades.reduce(
      (acc: number, grade: any) => acc + grade.value,
      0
    );
    return (totalPoints / grades.length).toFixed(2);
  };

  // Group grades by course
  const groupedGrades = grades?.reduce((acc: any, grade: any) => {
    const courseId = grade.course.id;
    if (!acc[courseId]) {
      acc[courseId] = {
        courseId,
        courseName: grade.course.name,
        grades: [],
      };
    }
    acc[courseId].grades.push(grade);
    return acc;
  }, {});

  // Calculate stats
  const calculateStats = () => {
    if (!grades || grades.length === 0)
      return {
        highest: 0,
        lowest: 0,
        average: 0,
        passingRate: 0,
      };

    const values = grades.map((g: any) => g.value);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const average =
      values.reduce((acc: number, val: number) => acc + val, 0) / values.length;
    const passing = grades.filter((g: any) => g.value >= 60).length;
    const passingRate = (passing / grades.length) * 100;

    return {
      highest,
      lowest,
      average,
      passingRate,
    };
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Grade Report</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall GPA</CardDescription>
              <CardTitle className="text-4xl font-bold">{calculateGPA()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Based on {grades?.length || 0} grades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Highest Grade</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.highest.toFixed(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getGradeLetter(stats.highest)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {stats.average.toFixed(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getGradeLetter(stats.average)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Passing Rate</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {Math.round(stats.passingRate)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.passingRate} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Grade Distribution
            </CardTitle>
            <CardDescription>
              Overview of your grades across different ranges
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {grades && grades.length > 0 ? (
              <div className="space-y-4">
                {/* A Range: 90-100 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>A (90-100)</span>
                    <span>
                      {
                        grades.filter((g: any) => g.value >= 90 && g.value <= 100).length
                      }{" "}
                      grades
                    </span>
                  </div>
                  <Progress
                    value={
                      (grades.filter((g: any) => g.value >= 90 && g.value <= 100).length /
                        grades.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* B Range: 80-89 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>B (80-89)</span>
                    <span>
                      {grades.filter((g: any) => g.value >= 80 && g.value < 90).length}{" "}
                      grades
                    </span>
                  </div>
                  <Progress
                    value={
                      (grades.filter((g: any) => g.value >= 80 && g.value < 90).length /
                        grades.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* C Range: 70-79 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>C (70-79)</span>
                    <span>
                      {grades.filter((g: any) => g.value >= 70 && g.value < 80).length}{" "}
                      grades
                    </span>
                  </div>
                  <Progress
                    value={
                      (grades.filter((g: any) => g.value >= 70 && g.value < 80).length /
                        grades.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* D Range: 60-69 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>D (60-69)</span>
                    <span>
                      {grades.filter((g: any) => g.value >= 60 && g.value < 70).length}{" "}
                      grades
                    </span>
                  </div>
                  <Progress
                    value={
                      (grades.filter((g: any) => g.value >= 60 && g.value < 70).length /
                        grades.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* F Range: 0-59 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>F (0-59)</span>
                    <span>
                      {grades.filter((g: any) => g.value < 60).length} grades
                    </span>
                  </div>
                  <Progress
                    value={
                      (grades.filter((g: any) => g.value < 60).length / grades.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No grade data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grades by Course */}
        <h2 className="text-2xl font-bold mb-4">Grades by Course</h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : grades && grades.length > 0 ? (
          <div className="space-y-6">
            {Object.values(groupedGrades || {}).map((courseData: any) => (
              <Card key={courseData.courseId}>
                <CardHeader>
                  <CardTitle>{courseData.courseName}</CardTitle>
                  <CardDescription>
                    {courseData.grades.length} assessment
                    {courseData.grades.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Grade Value</TableHead>
                        <TableHead>Letter</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseData.grades
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        )
                        .map((grade: any) => (
                          <TableRow key={grade.id}>
                            <TableCell>{formatDate(grade.date)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  grade.value >= 70
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                                    : grade.value >= 50
                                    ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
                                }
                              >
                                {grade.value.toFixed(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{getGradeLetter(grade.value)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-2">No grades available</p>
              <p className="text-sm">
                Grades will appear here once they are entered by your instructors
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
