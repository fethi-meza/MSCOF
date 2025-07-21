
import { useEffect, useState } from "react";
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
import { Formation } from "@/types";

interface EditFormationModalProps {
  formationId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditFormationModal({ formationId, isOpen, onClose }: EditFormationModalProps) {
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
      instructorId: ""
    }
  });

  const { data: formation, isLoading } = useQuery({
    queryKey: ["formation", formationId],
    queryFn: () => formationId ? formationsService.getFormationById(formationId) : null,
    enabled: isOpen && !!formationId
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
    },
    enabled: isOpen
  });

  useEffect(() => {
    if (formation) {
      form.reset({
        name: formation.name || "",
        description: formation.description || "",
        image: formation.image || "",
        availableSpots: formation.availableSpots || 20,
        durationInHours: formation.durationInHours || 10,
        startDate: formation.startDate ? new Date(formation.startDate).toISOString().split('T')[0] : "",
        endDate: formation.endDate ? new Date(formation.endDate).toISOString().split('T')[0] : "",
        instructorId: formation.instructorId ? formation.instructorId.toString() : ""
      });
    }
  }, [formation, form]);

  const updateFormationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Formation> }) => 
      formationsService.updateFormation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formations"] });
      queryClient.invalidateQueries({ queryKey: ["formation", formationId] });
      toast.success("Formation updated successfully");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating formation:", error);
      toast.error("Failed to update formation");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: any) => {
    if (!formationId) return;
    
    setIsSubmitting(true);
    
    // Convert string values to appropriate types
    const formationData = {
      ...data,
      availableSpots: Number(data.availableSpots),
      durationInHours: Number(data.durationInHours),
      instructorId: data.instructorId ? Number(data.instructorId) : undefined
    };
    
    updateFormationMutation.mutate({ id: formationId, data: formationData });
  };

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Formation</DialogTitle>
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
                    <Input {...field} placeholder="Enter image URL" />
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
                {isSubmitting ? "Updating..." : "Update Formation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
