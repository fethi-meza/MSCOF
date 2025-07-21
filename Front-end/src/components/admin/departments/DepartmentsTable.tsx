
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building, FileEdit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Department } from "@/types";
import { departmentsService } from "@/services/departments.service";

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (id: number) => void;
}

export function DepartmentsTable({ departments, isLoading, onEdit }: DepartmentsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteDepartmentMutation = useMutation({
    mutationFn: departmentsService.deleteDepartment,
    onSuccess: () => {
      toast.success("Department deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteDepartmentMutation.mutate(id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                Loading department data...
              </TableCell>
            </TableRow>
          ) : departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Building className="h-10 w-10 mb-2" />
                  <p>No departments found.</p>
                  <p className="text-sm">Add your first department to get started</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description || "No description provided"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(department.id)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Department</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{department.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(department.id)}
                            disabled={deletingId === department.id}
                          >
                            {deletingId === department.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
