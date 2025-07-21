
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { instructorsService } from "@/services/instructors.service";
import { InstructorsTable } from "@/components/admin/instructors/InstructorsTable";
import { AddInstructorModal } from "@/components/admin/instructors/AddInstructorModal";
import { EditInstructorModal } from "@/components/admin/instructors/EditInstructorModal";
import { ViewInstructorModal } from "@/components/admin/instructors/ViewInstructorModal";

export default function InstructorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editInstructorId, setEditInstructorId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewInstructorId, setViewInstructorId] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: instructors, isLoading, refetch } = useQuery({
    queryKey: ["instructors"],
    queryFn: instructorsService.getAllInstructors,
  });

  const handleEditInstructor = (id: number) => {
    setEditInstructorId(id);
    setIsEditModalOpen(true);
  };

  const handleViewInstructor = (id: number) => {
    setViewInstructorId(id);
    setIsViewModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Instructors</h1>
            <p className="text-muted-foreground mt-1">Manage university instructors</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Instructor List</CardTitle>
            <CardDescription>
              View and manage all university instructors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstructorsTable 
              instructors={instructors || []} 
              isLoading={isLoading}
              onEdit={handleEditInstructor}
              onView={handleViewInstructor}
            />
          </CardContent>
        </Card>
      </div>

      <AddInstructorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      <EditInstructorModal
        instructorId={editInstructorId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          refetch();
        }}
      />

      <ViewInstructorModal
        instructorId={viewInstructorId}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </MainLayout>
  );
}
