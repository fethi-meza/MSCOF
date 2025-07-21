
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, FileEdit, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Instructor } from "@/types";
import { instructorsService } from "@/services/instructors.service";

interface InstructorsTableProps {
  instructors: Instructor[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
}

export function InstructorsTable({ instructors, isLoading, onEdit, onView }: InstructorsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const deleteInstructorMutation = useMutation({
    mutationFn: instructorsService.deleteInstructor,
    onSuccess: () => {
      toast.success("Instructor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
    onError: (error) => {
      console.error("Error deleting instructor:", error);
      toast.error("Failed to delete instructor");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    setDeletingId(id);
    deleteInstructorMutation.mutate(id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading instructor data...
              </TableCell>
            </TableRow>
          ) : instructors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center text-muted-foreground">
                  <UserCog className="h-10 w-10 mb-2" />
                  <p>No instructors found.</p>
                  <p className="text-sm">Add your first instructor to get started</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell className="font-medium">
                  {instructor.firstName} {instructor.lastName}
                </TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>
                  {instructor.specialization || 
                    <span className="text-muted-foreground text-sm italic">Not specified</span>}
                </TableCell>
                <TableCell>
                  {instructor.department?.name || 
                    <span className="text-muted-foreground text-sm italic">Not assigned</span>}
                </TableCell>
                <TableCell>
                  {instructor.isSpecialist ? (
                    <Badge variant="default">Specialist</Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(instructor.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(instructor.id)}>
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
                          <AlertDialogTitle>Delete Instructor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {instructor.firstName} {instructor.lastName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(instructor.id)}
                            disabled={deletingId === instructor.id}
                          >
                            {deletingId === instructor.id ? "Deleting..." : "Delete"}
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
