
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  ChevronRight,
  Users,
} from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "student") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const { data: enrollments } = useQuery({
    queryKey: ["student-enrollments", user?.id],
    queryFn: async () => {
      const response = await api.get(`/students/${user?.id}/formations`);
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  const { data: grades } = useQuery({
    queryKey: ["student-grades", user?.id],
    queryFn: async () => {
      const response = await api.get(`/students/${user?.id}/grades`);
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  const { data: attendance } = useQuery({
    queryKey: ["student-attendance", user?.id],
    queryFn: async () => {
      const response = await api.get(`/students/${user?.id}/attendance`);
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate GPA
  const calculateGPA = () => {
    if (!grades || grades.length === 0) return "N/A";
    
    const totalPoints = grades.reduce((acc: number, grade: any) => acc + grade.value, 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  // Get attendance rate
  const getAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return "N/A";
    
    const present = attendance.filter(
      (a: any) => a.status === "PRESENT"
    ).length;
    return `${Math.round((present / attendance.length) * 100)}%`;
  };

  // Get active formations
  const activeFormations = enrollments?.filter(
    (enrollment: any) =>
      enrollment.status === "ACTIVE" &&
      new Date(enrollment.formation.endDate) >= new Date()
  );

  // Get next class
  const getNextClass = () => {
    if (!activeFormations || activeFormations.length === 0) return null;
    
    const today = new Date();
    const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const todayName = dayNames[today.getDay()];
    
    // Get all schedules
    const allSchedules = activeFormations.flatMap((enrollment: any) =>
      enrollment.formation.schedules?.map((schedule: any) => ({
        ...schedule,
        formation: enrollment.formation,
      }))
    );
    
    if (!allSchedules || allSchedules.length === 0) return null;
    
    // Get today's schedules
    let todaySchedules = allSchedules.filter(
      (schedule: any) => schedule.dayOfWeek === todayName
    );
    
    // Sort by start time
    if (todaySchedules.length > 0) {
      return todaySchedules.sort((a: any, b: any) => {
        const aTime = a.startTime.split(":").map(Number);
        const bTime = b.startTime.split(":").map(Number);
        return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1]);
      })[0];
    }
    
    // If no classes today, find next day with classes
    let nextDay = today.getDay() + 1;
    for (let i = 0; i < 7; i++) {
      if (nextDay > 6) nextDay = 0; // Loop back to Sunday
      
      const nextDaySchedules = allSchedules.filter(
        (schedule: any) => schedule.dayOfWeek === dayNames[nextDay]
      );
      
      if (nextDaySchedules.length > 0) {
        // Sort by start time
        const nextClass = nextDaySchedules.sort((a: any, b: any) => {
          const aTime = a.startTime.split(":").map(Number);
          const bTime = b.startTime.split(":").map(Number);
          return aTime[0] * 60 + aTime[1] - (bTime[0] * 60 + bTime[1]);
        })[0];
        
        return { ...nextClass, isNextDay: true, day: dayNames[nextDay] };
      }
      
      nextDay++;
    }
    
    return null;
  };

  const nextClass = getNextClass();

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}. Here's your academic overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/student/formations">
                <Users className="mr-2 h-4 w-4" />
                My Formations
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/student/grades">
                <FileText className="mr-2 h-4 w-4" />
                View All Grades
              </Link>
            </Button>
            <Button asChild>
              <Link to="/formations">
                <GraduationCap className="mr-2 h-4 w-4" />
                Browse Formations
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>GPA</CardDescription>
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
              <CardDescription>Attendance</CardDescription>
              <CardTitle className="text-4xl font-bold">{getAttendanceRate()}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  attendance?.length > 0
                    ? (attendance.filter((a: any) => a.status === "PRESENT").length /
                        attendance.length) *
                      100
                    : 0
                }
                className="h-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Formations</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {activeFormations?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Out of {enrollments?.length || 0} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completion</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {enrollments?.filter((e: any) => e.status === "COMPLETED").length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Completed courses</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Formations */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Active Formations</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/student/schedule" className="flex items-center">
                      View Schedule <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardDescription>
                  Your currently active formations and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeFormations && activeFormations.length > 0 ? (
                  <div className="space-y-4">
                    {activeFormations.map((enrollment: any) => {
                      const formation = enrollment.formation;
                      // Calculate days passed
                      const startDate = new Date(formation.startDate);
                      const endDate = new Date(formation.endDate);
                      const today = new Date();
                      
                      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const passedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const progress = Math.min(Math.max(0, Math.round((passedDays / totalDays) * 100)), 100);
                      
                      return (
                        <div
                          key={enrollment.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                            <div>
                              <h3 className="font-medium">{formation.name}</h3>
                              {formation.instructor && (
                                <p className="text-sm text-muted-foreground">
                                  Instructor: {formation.instructor.firstName}{" "}
                                  {formation.instructor.lastName}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline">
                              Ends {formatDate(formation.endDate)}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          
                          <div className="flex justify-end mt-4">
                            <Button asChild size="sm">
                              <Link to={`/formations/${formation.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">
                      You're not enrolled in any active formations
                    </p>
                    <Button asChild>
                      <Link to="/formations">Browse Available Formations</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Grades</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/student/grades" className="flex items-center">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {grades && grades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.slice(0, 5).map((grade: any) => (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">
                            {grade.course.name}
                          </TableCell>
                          <TableCell>{formatDate(grade.date)}</TableCell>
                          <TableCell className="text-right">
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No grades available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Class Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Class</CardTitle>
              </CardHeader>
              <CardContent>
                {nextClass ? (
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-medium text-lg">
                        {nextClass.formation.name}
                      </h3>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {nextClass.isNextDay ? nextClass.day : "Today"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {nextClass.startTime} - {nextClass.endTime}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{nextClass.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <Link to={`/formations/${nextClass.formation.id}`}>
                        View Formation Details
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming classes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Course Materials</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Student Handbook</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>Academic Calendar</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="font-medium">End of Term Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Final exams begin on July 10
                  </p>
                </div>
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                  <p className="font-medium">New Course Registration</p>
                  <p className="text-sm text-muted-foreground">
                    Registration for Fall semester opens next week
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="font-medium">System Maintenance</p>
                  <p className="text-sm text-muted-foreground">
                    The portal will be down for maintenance on Sunday night
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Announcements</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
