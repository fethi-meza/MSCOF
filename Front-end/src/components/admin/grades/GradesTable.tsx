
import { FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Grade, Course } from "@/types";

interface GradesTableProps {
  grades: Grade[];
  isLoading: boolean;
  onEditGrade: (id: number) => void;
  onDeleteGrade: (id: number) => void;
}

export function GradesTable({ grades, isLoading, onEditGrade, onDeleteGrade }: GradesTableProps) {
  const getGradeColorClass = (value: number) => {
    if (value >= 90) return "text-green-600";
    if (value >= 80) return "text-emerald-600";
    if (value >= 70) return "text-yellow-600";
    if (value >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading grade data...
              </TableCell>
            </TableRow>
          ) : grades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No grades found.
              </TableCell>
            </TableRow>
          ) : (
            grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">
                  {grade.student?.firstName} {grade.student?.lastName}
                </TableCell>
                <TableCell>{grade.course?.name || `Course #${grade.courseId}`}</TableCell>
                <TableCell>
                  <span className={`font-bold ${getGradeColorClass(grade.value)}`}>
                    {grade.value}%
                  </span>
                </TableCell>
                <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEditGrade(grade.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Grade</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this grade? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteGrade(grade.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
