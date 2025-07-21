
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { departmentsService } from "@/services/departments.service";
import { DepartmentsTable } from "@/components/admin/departments/DepartmentsTable";
import { AddDepartmentModal } from "@/components/admin/departments/AddDepartmentModal";
import { EditDepartmentModal } from "@/components/admin/departments/EditDepartmentModal";

export default function DepartmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsService.getAllDepartments,
  });

  const handleEditDepartment = (id: number) => {
    setEditDepartmentId(id);
    setIsEditModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground mt-1">Manage university departments</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Department List</CardTitle>
            <CardDescription>
              View and manage all university departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentsTable 
              departments={departments || []} 
              isLoading={isLoading}
              onEdit={handleEditDepartment}
            />
          </CardContent>
        </Card>
      </div>

      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditDepartmentModal
        departmentId={editDepartmentId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </MainLayout>
  );
}
