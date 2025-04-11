
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import StudentList, { Student } from '@/components/students/StudentList';
import StudentForm from '@/components/students/StudentForm';
import { useToast } from '@/components/ui/use-toast';

const Students = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const { toast } = useToast();

  const handleAddStudent = (data: any) => {
    console.log('Adding student:', data);
    toast({
      title: 'Student Added',
      description: `${data.firstName} ${data.lastName} has been added successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (data: any) => {
    console.log('Editing student:', data);
    toast({
      title: 'Student Updated',
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage student records, view profiles, and track progress.</p>
      </div>
      
      <StudentList 
        onAddClick={() => setIsAddDialogOpen(true)}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
      />
      
      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Enter the information for the new student. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <StudentForm 
            onSubmit={handleAddStudent}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <StudentForm 
              student={selectedStudent}
              onSubmit={handleEditStudent}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Information</DialogTitle>
            <DialogDescription>
              Complete details for the selected student.
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                  <p className="text-base">{selectedStudent.firstName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                  <p className="text-base">{selectedStudent.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedStudent.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{selectedStudent.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Enrollment Date</h3>
                  <p className="text-base">{new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
