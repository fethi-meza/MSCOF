
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookPlus, Book, Info } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { ViewCourseModal } from "@/components/admin/courses/ViewCourseModal";
import { EditCourseModal } from "@/components/admin/courses/EditCourseModal";
import { AddCourseModal } from "@/components/admin/courses/AddCourseModal";
import { Badge } from "@/components/ui/badge";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCourseId, setViewCourseId] = useState<number | null>(null);
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get('/courses');
      return response.data.data;
    },
  });

  // Filter courses based on search term
  const filteredCourses = courses?.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.department && course.department.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.formation && course.formation.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleViewCourse = (id: number) => {
    setViewCourseId(id);
    setIsViewModalOpen(true);
  };

  const handleEditCourse = (id: number) => {
    setEditCourseId(id);
    setIsEditModalOpen(true);
  };

  const handleAddCourse = () => {
    setIsAddModalOpen(true);
  };

  if (error) {
    toast.error("Failed to load courses", {
      description: "There was an error loading the course data."
    });
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground mt-1">Manage educational courses</p>
          </div>
          <Button onClick={handleAddCourse}>
            <BookPlus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Course List</CardTitle>
            <CardDescription>
              {filteredCourses.length} total courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading courses...
                      </TableCell>
                    </TableRow>
                  ) : filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center">
                              <Book className="h-4 w-4 text-primary" />
                            </div>
                            {course.name}
                          </div>
                        </TableCell>
                        <TableCell>{course.department?.name || "N/A"}</TableCell>
                        <TableCell>
                          {course.formation ? (
                            <Badge variant="outline" className="bg-primary/10">
                              {course.formation.name}
                            </Badge>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {course.description || "No description available"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCourse(course.id)}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditCourse(course.id)}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ViewCourseModal 
          courseId={viewCourseId}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />

        <EditCourseModal 
          courseId={editCourseId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />

        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
