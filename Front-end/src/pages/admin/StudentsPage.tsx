import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, User, Trash2, Check, X, Calendar, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { studentsService } from "@/services/students.service";
import { enrollmentsService } from "@/services/enrollments.service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { Student } from "@/types";
import { ViewStudentModal } from "@/components/admin/students/ViewStudentModal";
import { EditStudentModal } from "@/components/admin/students/EditStudentModal";
import { AddStudentModal } from "@/components/admin/students/AddStudentModal";
import { format } from 'date-fns';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollmentSearchTerm, setEnrollmentSearchTerm] = useState("");
  const [viewStudentId, setViewStudentId] = useState<number | null>(null);
  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: students, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: studentsService.getAllStudents
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: enrollmentsService.getAllEnrollments,
  });

  const deleteStudentMutation = useMutation({
    mutationFn: studentsService.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    }
  });

  const updateEnrollmentStatusMutation = useMutation({
    mutationFn: ({ enrollmentId, status }: { enrollmentId: number; status: string }) =>
      enrollmentsService.updateEnrollmentStatus(enrollmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-enrollments'] });
      toast.success('Enrollment status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update enrollment status');
    },
  });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: enrollmentsService.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-enrollments'] });
      toast.success('Enrollment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete enrollment');
    },
  });

  // Filter students based on search term
  const filteredStudents = students?.filter((student: Student) => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter enrollments based on search term
  const filteredEnrollments = enrollments.filter((enrollment: any) =>
    enrollment.student?.firstName?.toLowerCase().includes(enrollmentSearchTerm.toLowerCase()) ||
    enrollment.student?.lastName?.toLowerCase().includes(enrollmentSearchTerm.toLowerCase()) ||
    enrollment.formation?.name?.toLowerCase().includes(enrollmentSearchTerm.toLowerCase())
  );

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

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleViewStudent = (id: number) => {
    setViewStudentId(id);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (id: number) => {
    setEditStudentId(id);
    setIsEditModalOpen(true);
  };

  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id);
  };

  const handleApproveEnrollment = (enrollmentId: number) => {
    updateEnrollmentStatusMutation.mutate({ enrollmentId, status: 'ACTIVE' });
  };

  const handleRejectEnrollment = (enrollmentId: number) => {
    updateEnrollmentStatusMutation.mutate({ enrollmentId, status: 'CANCELLED' });
  };

  const handleDeleteEnrollment = (enrollmentId: number) => {
    deleteEnrollmentMutation.mutate(enrollmentId);
  };

  if (error) {
    toast.error("Failed to load students", {
      description: "There was an error loading the student data."
    });
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students Management</h1>
            <p className="text-muted-foreground mt-1">Manage all registered students and their enrollments</p>
          </div>
          <Button onClick={handleAddStudent}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="enrollments">Student Enrollments</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  {filteredStudents.length} total students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search students..."
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
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading students...
                          </TableCell>
                        </TableRow>
                      ) : filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No students found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student: Student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center overflow-hidden">
                                  {student.photo ? (
                                    <img 
                                      src={student.photo} 
                                      alt={`${student.firstName} ${student.lastName}`} 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "";
                                        (e.target as HTMLImageElement).parentElement!.classList.add("bg-primary/10");
                                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                                      }}
                                    />
                                  ) : (
                                    <User className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                {student.firstName} {student.lastName}
                              </div>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
                                {student.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewStudent(student.id)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditStudent(student.id)}
                                >
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Student</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {student.firstName} {student.lastName}? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteStudent(student.id)}
                                      >
                                        Delete
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollments">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Enrollments</CardDescription>
                  <CardTitle className="text-4xl font-bold">{enrollments.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active</CardDescription>
                  <CardTitle className="text-4xl font-bold text-green-600">
                    {enrollments.filter((e: any) => e.status === 'ACTIVE').length}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Completed</CardDescription>
                  <CardTitle className="text-4xl font-bold text-blue-600">
                    {enrollments.filter((e: any) => e.status === 'COMPLETED').length}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Cancelled</CardDescription>
                  <CardTitle className="text-4xl font-bold text-red-600">
                    {enrollments.filter((e: any) => e.status === 'CANCELLED').length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Student Enrollments Management
                </CardTitle>
                <CardDescription>View and manage all student enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by student name or formation..."
                    className="pl-8"
                    value={enrollmentSearchTerm}
                    onChange={(e) => setEnrollmentSearchTerm(e.target.value)}
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Formation</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollmentsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Loading enrollments...
                          </TableCell>
                        </TableRow>
                      ) : filteredEnrollments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No enrollments found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEnrollments.map((enrollment: any) => (
                          <TableRow key={enrollment.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    {enrollment.student?.firstName} {enrollment.student?.lastName}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {enrollment.student?.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{enrollment.formation?.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(enrollment.formation?.startDate)} - {formatDate(enrollment.formation?.endDate)}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                            <TableCell>
                              <Badge className={getEnrollmentStatusColor(enrollment.status)}>
                                {enrollment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {enrollment.status !== 'ACTIVE' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApproveEnrollment(enrollment.id)}
                                    disabled={updateEnrollmentStatusMutation.isPending}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                {enrollment.status === 'ACTIVE' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectEnrollment(enrollment.id)}
                                    disabled={updateEnrollmentStatusMutation.isPending}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                )}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteEnrollment(enrollment.id)}
                                  disabled={deleteEnrollmentMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
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
          </TabsContent>
        </Tabs>

        <ViewStudentModal 
          studentId={viewStudentId}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />

        <EditStudentModal 
          studentId={editStudentId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />

        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
