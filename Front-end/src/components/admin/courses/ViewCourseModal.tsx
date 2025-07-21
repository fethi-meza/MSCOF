
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { coursesService } from "@/services/courses.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ViewCourseModalProps {
  courseId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewCourseModal({ courseId, isOpen, onClose }: ViewCourseModalProps) {
  const [activeTab, setActiveTab] = useState("details");

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesService.getCourseById(courseId!),
    enabled: isOpen && !!courseId,
  });

  if (error) {
    toast.error("Failed to load course details");
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">Loading course details...</div>
        ) : !course ? (
          <div className="text-center py-6">Course not found</div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="grades">Student Grades</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{course.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{course.department?.name || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{course.description || 'No description available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grades">
              {course.grades?.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>
                            {grade.student.firstName} {grade.student.lastName}
                          </TableCell>
                          <TableCell>{grade.value}%</TableCell>
                          <TableCell>
                            {new Date(grade.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6">No grades recorded for this course</div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
