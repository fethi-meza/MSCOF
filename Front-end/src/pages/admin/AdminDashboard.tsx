
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { RecentFormations } from "@/components/admin/dashboard/RecentFormations";
import { StudentStats } from "@/components/admin/dashboard/StudentStats";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { UpcomingEvents } from "@/components/admin/dashboard/UpcomingEvents";

import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get("/students");
      return response.data.data;
    },
  });

  const { data: instructors } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      const response = await api.get("/instructors");
      return response.data.data || [];
    },
    retry: false,
  });

  // Stats
  const activeStudents = students?.filter((student: any) => student.status === "ACTIVE")?.length || 0;
  const totalStudents = students?.length || 0;
  const graduatedStudents = students?.filter((s: any) => s.status === "GRADUATED")?.length || 0;
  const droppedStudents = students?.filter((s: any) => s.status === "DROPPED")?.length || 0;
  
  const { data: formations } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const response = await api.get("/formations");
      return response.data.data;
    },
  });
  
  const activeFormations = formations?.filter(
    (formation: any) => new Date(formation.endDate) >= new Date()
  )?.length || 0;
  const totalFormations = formations?.length || 0;
  
  const instructorsCount = instructors?.length || 0;
  const specialistsCount = instructors?.filter((i: any) => i.isSpecialist)?.length || 0;
  
  const enrollmentRate = formations && formations.length > 0
    ? Math.round(
        (formations.reduce(
          (acc: number, formation: any) =>
            acc + (formation.availableSpots - (formation.remainingSpots || 0)),
          0
        ) /
          formations.reduce(
            (acc: number, formation: any) => acc + formation.availableSpots,
            0
          )) *
          100
      )
    : 0;

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <DashboardHeader />
        
        <StatsCards
          totalStudents={totalStudents}
          activeStudents={activeStudents}
          activeFormations={activeFormations}
          totalFormations={totalFormations}
          instructorsCount={instructorsCount}
          specialistsCount={specialistsCount}
          enrollmentRate={enrollmentRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <RecentFormations />
            <StudentStats 
              activeStudents={activeStudents}
              graduatedStudents={graduatedStudents}
              droppedStudents={droppedStudents}
            />
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            <QuickActions />
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
