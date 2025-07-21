
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronRight, GraduationCap, Users } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api";
import { Formation } from "@/types";
import { useAuth } from "@/lib/auth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [upcomingFormations, setUpcomingFormations] = useState<Formation[]>([]);

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const response = await api.get("/formations");
      return response.data.data as Formation[];
    },
    enabled: true,
  });

  useEffect(() => {
    if (formations) {
      // Filter formations that haven't started yet or started recently
      const upcoming = formations
        .filter((formation) => {
          const startDate = new Date(formation.startDate);
          const now = new Date();
          // Include formations starting within the next 30 days
          return (
            startDate > now ||
            (startDate <= now &&
              new Date(formation.endDate) > now)
          );
        })
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )
        .slice(0, 3);

      setUpcomingFormations(upcoming);
    }
  }, [formations]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
    {/* Hero Section */}
<section 
  className="py-12 md:py-24 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg mt-8 relative overflow-hidden"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&h=900&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "overlay"
  }}
>
  <div className="container max-w-6xl mx-auto px-4 relative z-10">
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-black mb-4">
          MSCOF Formation
        </h1>
        <p className="text-lg md:text-xl text-black dark:text-black mb-8">
          Your complete education management platform for students,
          instructors, and administrators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/formations">Browse Formations</Link>
          </Button>
          {!isAuthenticated && (
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/register">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <img
          src="***********https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400&q=80"
          alt="MSCOF Formation Hub - Woman using laptop for education"
          className="rounded-lg shadow-lg max-w-full h-auto"
          width={600}
          height={400}
        />
      </div>
    </div>
  </div>
</section>
{/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* Features Section */}
      <section className="py-16 container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                Comprehensive Courses
              </CardTitle>
              <GraduationCap size={28} className="text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Access a wide range of courses and training formations with
                detailed schedules and resources.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                Easy Scheduling
              </CardTitle>
              <Calendar size={28} className="text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                View your class schedule, manage enrollment, and track upcoming
                events in one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">
                Expert Instructors
              </CardTitle>
              <Users size={28} className="text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Learn from qualified specialists with expertise in their
                respective fields.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Formations Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Formations</h2>
            <Button variant="ghost" asChild>
              <Link to="/formations" className="flex items-center">
                View all <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingFormations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingFormations.map((formation) => (
                <Link
                  to={`/formations/${formation.id}`}
                  key={formation.id}
                  className="hover:no-underline"
                >
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{formation.name}</CardTitle>
                      <CardDescription>
                        {formation.instructor
                          ? `Instructor: ${formation.instructor.firstName} ${formation.instructor.lastName}`
                          : "Instructor to be assigned"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Starts:</span>{" "}
                          {formatDate(formation.startDate)}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>{" "}
                          {formation.durationInHours} hours
                        </div>
                        <div>
                          <span className="font-medium">Available Spots:</span>{" "}
                          {formation.remainingSpots || "N/A"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No upcoming formations available.
              </p>
              <Button asChild className="mt-4">
                <Link to="/formations">Browse All Formations</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 container max-w-6xl mx-auto px-4">
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to start your educational journey?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto">
              Create an account today and get access to all formations and
              courses available on MSCOF Formation Hub.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full"
            >
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </section>
      )}
    </MainLayout>
  );
}