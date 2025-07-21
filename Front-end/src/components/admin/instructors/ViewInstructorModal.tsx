
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { instructorsService } from "@/services/instructors.service";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface ViewInstructorModalProps {
  instructorId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewInstructorModal({ instructorId, isOpen, onClose }: ViewInstructorModalProps) {
  const { data: instructor, isLoading } = useQuery({
    queryKey: ["instructor", instructorId],
    queryFn: () => instructorId ? instructorsService.getInstructorById(instructorId) : null,
    enabled: !!instructorId && isOpen,
  });

  const [notes, setNotes] = useState("");

  // Load notes from localStorage when instructor data loads
  useState(() => {
    if (instructor && instructorId) {
      const savedNotes = localStorage.getItem(`instructor_notes_${instructorId}`);
      if (savedNotes) {
        setNotes(savedNotes);
      } else {
        setNotes("");
      }
    }
  });

  const handleSaveNotes = () => {
    if (instructorId) {
      localStorage.setItem(`instructor_notes_${instructorId}`, notes);
      toast.success("Notes saved successfully");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Instructor Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-4">Loading instructor data...</div>
        ) : instructor ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                <p className="text-lg font-medium">{instructor.firstName} {instructor.lastName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p className="text-lg">{instructor.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                <p className="text-lg">{instructor.phoneNumber || "Not provided"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Department</h3>
                <p className="text-lg">{instructor.department?.name || "Not assigned"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Specialization</h3>
              <p className="text-lg">{instructor.specialization || "Not specified"}</p>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">Specialist:</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                instructor.isSpecialist ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {instructor.isSpecialist ? "Yes" : "No"}
              </div>
            </div>

            {instructor.classes && instructor.classes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Classes</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {instructor.classes.map((cls) => (
                    <li key={cls.id}>{cls.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <Textarea 
                placeholder="Add notes about this instructor here..." 
                className="min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleSaveNotes}
              >
                Save Notes
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Instructor not found or error loading data
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
