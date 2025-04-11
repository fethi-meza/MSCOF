
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import FormationList, { Formation } from '@/components/formations/FormationList';
import FormationForm from '@/components/formations/FormationForm';
import { useToast } from '@/components/ui/use-toast';

const Formations = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  
  const { toast } = useToast();

  const handleAddFormation = (data: any) => {
    console.log('Adding formation:', data);
    toast({
      title: 'Formation Added',
      description: `${data.name} has been added successfully.`,
    });
    setIsAddDialogOpen(false);
  };

  const handleEditFormation = (data: any) => {
    console.log('Editing formation:', data);
    toast({
      title: 'Formation Updated',
      description: `${data.name}'s information has been updated.`,
    });
    setIsEditDialogOpen(false);
  };

  const handleEditClick = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsEditDialogOpen(true);
  };

  const handleViewClick = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsViewDialogOpen(true);
  };

  const handleManageSchedule = (formation: Formation) => {
    setSelectedFormation(formation);
    setIsScheduleDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
        <p className="text-muted-foreground">Manage courses, schedules, and enrollment for training programs.</p>
      </div>
      
      <FormationList 
        onAddClick={() => setIsAddDialogOpen(true)}
        onEditClick={handleEditClick}
        onViewClick={handleViewClick}
        onManageSchedule={handleManageSchedule}
      />
      
      {/* Add Formation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Formation</DialogTitle>
            <DialogDescription>
              Enter the information for the new formation. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <FormationForm 
            onSubmit={handleAddFormation}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Formation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Formation</DialogTitle>
            <DialogDescription>
              Update the formation's information.
            </DialogDescription>
          </DialogHeader>
          {selectedFormation && (
            <FormationForm 
              formation={selectedFormation}
              onSubmit={handleEditFormation}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* View Formation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Formation Information</DialogTitle>
            <DialogDescription>
              Complete details for the selected formation.
            </DialogDescription>
          </DialogHeader>
          {selectedFormation && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{selectedFormation.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p className="text-base">{selectedFormation.durationInHours} hours</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p className="text-base">{new Date(selectedFormation.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p className="text-base">{new Date(selectedFormation.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Available Spots</h3>
                  <p className="text-base">{selectedFormation.availableSpots} / {selectedFormation.totalSpots}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Instructor</h3>
                  <p className="text-base">{selectedFormation.instructorName || 'Not assigned'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">{selectedFormation.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Schedule</DialogTitle>
            <DialogDescription>
              {selectedFormation?.name} - Schedule management
            </DialogDescription>
          </DialogHeader>
          {selectedFormation && (
            <div className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                The schedule management interface will be implemented in the next phase.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Formations;
