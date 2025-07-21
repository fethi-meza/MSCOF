
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  MapPin,
  School,
  User,
  Users,
} from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Formation } from "@/types";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export default function FormationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: formation, isLoading, refetch } = useQuery({
    queryKey: ["formation", id],
    queryFn: async () => {
      const response = await api.get(`/formations/${id}`);
      return response.data.data as Formation;
    },
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to enroll in this formation",
        variant: "destructive",
      });
      return;
    }

    if (user?.role !== "student") {
      toast({
        title: "Not authorized",
        description: "Only students can enroll in formations",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsEnrolling(true);
      await api.post(`/formations/${id}/enroll`);
      toast({
        title: "Enrollment successful",
        description: "You have been enrolled in this formation",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description:
          error.response?.data?.message ||
          "Failed to enroll in this formation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Format date with time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date without time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if formation is available
  const isFormationAvailable = (formation: Formation) => {
    const now = new Date();
    const startDate = new Date(formation.startDate);
    return (
      startDate > now &&
      (formation.remainingSpots === undefined || formation.remainingSpots > 0)
    );
  };

  // Check if a formation is ongoing
  const isFormationOngoing = (formation: Formation) => {
    const now = new Date();
    const startDate = new Date(formation.startDate);
    const endDate = new Date(formation.endDate);
    return startDate <= now && endDate >= now;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading formation details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!formation) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Formation Not Found</h1>
            <p className="mb-6">The formation you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/formations">Back to Formations</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <Link
            to="/formations"
            className="text-sm flex items-center mb-6 hover:underline"
          >
            ← Back to all formations
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{formation.name}</h1>
                {isFormationAvailable(formation) ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                    Available
                  </Badge>
                ) : isFormationOngoing(formation) ? (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    Ongoing
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30">
                    Upcoming
                  </Badge>
                )}
              </div>
              {formation.instructor && (
                <p className="text-muted-foreground">
                  Instructor: {formation.instructor.firstName}{" "}
                  {formation.instructor.lastName}
                </p>
              )}
            </div>
            {user?.role === "student" && isFormationAvailable(formation) && (
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling || !formation.remainingSpots}
                className="w-full md:w-auto"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : formation.remainingSpots ? (
                  "Enroll Now"
                ) : (
                  "No Spots Available"
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About this formation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{formation.description || "No description available."}</p>
                    
                    {formation.instructor && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Instructor</h3>
                        <div className="flex items-start gap-4">
                          <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {formation.instructor.firstName}{" "}
                              {formation.instructor.lastName}
                            </p>
                            {formation.instructor.specialization && (
                              <p className="text-muted-foreground text-sm">
                                {formation.instructor.specialization}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Formation Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formation.schedules && formation.schedules.length > 0 ? (
                      <div className="space-y-4">
                        {formation.schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex flex-col border rounded-lg p-4"
                          >
                            <div className="flex items-center mb-2">
                              <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                              <span className="font-medium">{schedule.dayOfWeek}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{schedule.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No schedule information available yet.</p>
                    )}

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Key Dates</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <span className="font-medium">Start Date:</span>{" "}
                            {formatDate(formation.startDate)}
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                          <div>
                            <span className="font-medium">End Date:</span>{" "}
                            {formatDate(formation.endDate)}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Formation Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 border rounded-md">
                        <FileText className="h-8 w-8 mr-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Formation Syllabus</p>
                          <p className="text-sm text-muted-foreground">
                            PDF document with course outline and objectives
                          </p>
                        </div>
                        <Button variant="outline" className="ml-auto" disabled>
                          Download
                        </Button>
                      </div>
                      
                      <p className="text-muted-foreground italic text-center mt-4">
                        More resources will be available after enrollment or when the formation begins.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Formation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{formation.durationInHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium">{formatDate(formation.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium">{formatDate(formation.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Spots</span>
                  <span className="font-medium">
                    {formation.remainingSpots !== undefined
                      ? `${formation.remainingSpots} / ${formation.availableSpots}`
                      : formation.availableSpots}
                  </span>
                </div>
                {formation.schedules && formation.schedules.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{formation.schedules[0].location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrollment
                </CardTitle>
                <CardDescription>
                  {isFormationAvailable(formation)
                    ? "Open for enrollment"
                    : isFormationOngoing(formation)
                    ? "Formation in progress"
                    : "Enrollment will open soon"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Capacity</span>
                      <span className="text-sm font-medium">
                        {formation.availableSpots - (formation.remainingSpots || 0)}/
                        {formation.availableSpots}
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{
                          width: `${
                            ((formation.availableSpots - (formation.remainingSpots || 0)) /
                              formation.availableSpots) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Sign in to enroll in this formation
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/login">Login</Link>
                      </Button>
                    </div>
                  ) : user?.role !== "student" ? (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Only students can enroll in formations
                    </p>
                  ) : isFormationOngoing(formation) ? (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      This formation has already started
                    </p>
                  ) : (
                    <div className="text-center mt-4">
                      {!isFormationAvailable(formation) ? (
                        <p className="text-sm text-muted-foreground">
                          Enrollment not yet available
                        </p>
                      ) : formation.remainingSpots ? (
                        <Button 
                          onClick={handleEnroll} 
                          disabled={isEnrolling} 
                          className="w-full"
                        >
                          {isEnrolling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            "Enroll Now"
                          )}
                        </Button>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No spots available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Prerequisites
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  No specific prerequisites required for this formation. Open to all
                  eligible students with basic knowledge in the subject area.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
