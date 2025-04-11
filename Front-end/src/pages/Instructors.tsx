
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import InstructorList, { Instructor } from '@/components/instructors/InstructorList';
import InstructorForm from '@/components/instructors/InstructorForm';
import { useToast } from '@/components/ui/use-toast';

const Instructors = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  
  const { toast } = useToast();

  const handleAddInstructor = (data: any) => {
    console.log('Adding instructor:', data);
    toast({
      title: 'Instructor Added',
      description: `${data.firstName} ${data.lastName} has been added successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditInstructor = (data: any) => {
    console.log('Editing instructor:', data);
    toast({
      title: 'Instructor Updated',
      description: `${data.firstName} ${data.lastName}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
        <p className="text-muted-foreground">Manage instructors, their specializations, and department assignments.</p>
      </div>
      
      <InstructorList 
        onAddClick={() => setIsAddDialogOpen(true)}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
      />
      
      {/* Add Instructor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Instructor</DialogTitle>
            <DialogDescription>
              Enter the information for the new instructor. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <InstructorForm 
            onSubmit={handleAddInstructor}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Instructor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Instructor</DialogTitle>
            <DialogDescription>
              Update the instructor's information.
            </DialogDescription>
          </DialogHeader>
          {selectedInstructor && (
            <InstructorForm 
              instructor={selectedInstructor}
              onSubmit={handleEditInstructor}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Instructor Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Instructor Information</DialogTitle>
            <DialogDescription>
              Complete details for the selected instructor.
            </DialogDescription>
          </DialogHeader>
          {selectedInstructor && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                  <p className="text-base">{selectedInstructor.firstName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                  <p className="text-base">{selectedInstructor.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedInstructor.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Specialization</h3>
                  <p className="text-base">{selectedInstructor.specialization}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="text-base">{selectedInstructor.departmentName || 'Not assigned'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Specialist</h3>
                  <p className="text-base">{selectedInstructor.isSpecialist ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Instructors;
