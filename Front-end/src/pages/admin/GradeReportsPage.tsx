
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { gradesService } from "@/services/grades.service";
import { coursesService } from "@/services/courses.service";
import { AddGradeModal } from "@/components/admin/grades/AddGradeModal";
import { EditGradeModal } from "@/components/admin/grades/EditGradeModal";
import { GradeStats } from "@/components/admin/grades/GradeStats";
import { GradeFilters } from "@/components/admin/grades/GradeFilters";
import { GradesTable } from "@/components/admin/grades/GradesTable";

export default function GradeReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [editGradeId, setEditGradeId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: grades, isLoading: gradesLoading, refetch } = useQuery({
    queryKey: ["grades"],
    queryFn: gradesService.getAllGrades,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: coursesService.getAllCourses,
  });

  const deleteGradeMutation = useMutation({
    mutationFn: gradesService.deleteGrade,
    onSuccess: () => {
      toast.success("Grade deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
    onError: (error) => {
      console.error("Error deleting grade:", error);
      toast.error("Failed to delete grade");
    },
  });

  const filteredGrades = grades?.filter(grade => {
    const matchesSearch = 
      grade.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      grade.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(grade.value).includes(searchTerm);
      
    const matchesCourse = courseFilter ? grade.courseId === parseInt(courseFilter) : true;
    
    return matchesSearch && matchesCourse;
  }) || [];

  const handleEditGrade = (id: number) => {
    setEditGradeId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteGrade = (id: number) => {
    deleteGradeMutation.mutate(id);
  };

  const exportToCSV = () => {
    if (!grades || grades.length === 0) {
      toast.error("No grades to export");
      return;
    }

    let csvContent = "Student,Course,Grade,Date\n";
    
    grades.forEach(grade => {
      const studentName = `${grade.student?.firstName || ''} ${grade.student?.lastName || ''}`;
      const courseName = grade.course?.name || `Course #${grade.courseId}`;
      const gradeValue = grade.value;
      const date = new Date(grade.date).toLocaleDateString();
      
      csvContent += `"${studentName}","${courseName}",${gradeValue},"${date}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `grades_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Grades exported successfully", {
      description: "The CSV file has been downloaded."
    });
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Grade Reports</h1>
            <p className="text-muted-foreground mt-1">View and manage student grades</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </div>
        </div>

        <GradeStats grades={grades || []} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Grade List</CardTitle>
            <CardDescription>
              View and manage all student grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GradeFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              courseFilter={courseFilter}
              onCourseFilterChange={setCourseFilter}
              courses={courses}
            />

            <GradesTable
              grades={filteredGrades}
              isLoading={gradesLoading}
              onEditGrade={handleEditGrade}
              onDeleteGrade={handleDeleteGrade}
            />
          </CardContent>
        </Card>
      </div>

      <AddGradeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      <EditGradeModal
        gradeId={editGradeId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          refetch();
        }}
      />
    </MainLayout>
  );
}
