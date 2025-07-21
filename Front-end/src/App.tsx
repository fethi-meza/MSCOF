
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import FormationsPage from "./pages/formations/FormationsPage";
import FormationDetailsPage from "./pages/formations/FormationDetailsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import GradesPage from "./pages/student/GradesPage";
import MyFormationsPage from "./pages/student/MyFormationsPage";

// Admin Pages
import StudentsPage from "./pages/admin/StudentsPage";
import CoursesPage from "./pages/admin/CoursesPage";
import AddFormationPage from "./pages/admin/AddFormationPage";
import GradeReportsPage from "./pages/admin/GradeReportsPage";
import FormationsManagePage from "./pages/admin/FormationsManagePage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import InstructorsPage from "./pages/admin/InstructorsPage";
import EnrollmentsPage from "./pages/admin/EnrollmentsPage";

// Auth Guard
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/formations/:id" element={<FormationDetailsPage />} />

            {/* Protected Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/grades"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <GradesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/formations"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyFormationsPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StudentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/formations/new"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddFormationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/formations"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FormationsManagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grades"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <GradeReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/instructors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <InstructorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EnrollmentsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
