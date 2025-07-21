
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Student } from "@/types";
import { studentsService } from "@/services/students.service";

interface ViewStudentModalProps {
  studentId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewStudentModal({ studentId, isOpen, onClose }: ViewStudentModalProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      
      setLoading(true);
      try {
        const data = await studentsService.getStudentById(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && studentId) {
      fetchStudent();
    }
  }, [studentId, isOpen]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "GRADUATED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "DROPPED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading student details...</div>
        ) : student ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First Name</p>
                <p className="font-medium">{student.firstName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Name</p>
                <p className="font-medium">{student.lastName}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{student.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{format(new Date(student.dateOfBirth), 'PP')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Enrollment Date</p>
                <p className="font-medium">{format(new Date(student.enrollmentDate), 'PP')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">Student not found</div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
