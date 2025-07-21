
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formationsService } from "@/services/formations.service";
import { departmentsService } from "@/services/departments.service";
import { Formation } from "@/types";

interface AddFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFormationModal({ isOpen, onClose }: AddFormationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      availableSpots: 20,
      durationInHours: 10,
      startDate: "",
      endDate: "",
      instructorId: "",
      departmentId: ""
    }
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ["instructors"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/instructors");
        const data = await response.json();
        return data.data || [];
      } catch (error) {
        console.error("Error fetching instructors:", error);
        return [];
      }
    }
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsService.getAllDepartments
  });

  const addFormationMutation = useMutation({
    mutationFn: (formationData: Partial<Formation>) => formationsService.createFormation(formationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formations"] });
      toast.success("Formation created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating formation:", error);
      toast.error("Failed to create formation");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Convert string values to appropriate types
    const formationData = {
      ...data,
      availableSpots: Number(data.availableSpots),
      durationInHours: Number(data.durationInHours),
      instructorId: data.instructorId ? Number(data.instructorId) : undefined,
      departmentId: data.departmentId ? Number(data.departmentId) : undefined
    };
    
    addFormationMutation.mutate(formationData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Formation</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter formation name" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter formation description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} placeholder="Enter image URL" className="flex-grow" />
                      {field.value && (
                        <div className="h-10 w-10 rounded-md border overflow-hidden flex-shrink-0">
                          <img 
                            src={field.value} 
                            alt="Formation preview" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableSpots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Spots</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="durationInHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department: any) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="instructorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an instructor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instructors.map((instructor: any) => (
                        <SelectItem key={instructor.id} value={instructor.id.toString()}>
                          {instructor.firstName} {instructor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Formation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
