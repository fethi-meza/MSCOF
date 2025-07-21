
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { instructorsService } from "@/services/instructors.service";
import { departmentsService } from "@/services/departments.service";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  specialization: z.string().optional(),
  isSpecialist: z.boolean().default(false),
  departmentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditInstructorModalProps {
  instructorId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditInstructorModal({ instructorId, isOpen, onClose }: EditInstructorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      specialization: "",
      isSpecialist: false,
      departmentId: "",
    },
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsService.getAllDepartments,
    enabled: isOpen,
  });

  const { data: instructor, isLoading } = useQuery({
    queryKey: ["instructor", instructorId],
    queryFn: () => instructorId ? instructorsService.getInstructorById(instructorId) : null,
    enabled: !!instructorId && isOpen,
  });

  useEffect(() => {
    if (instructor) {
      form.reset({
        firstName: instructor.firstName || "",
        lastName: instructor.lastName || "",
        phoneNumber: instructor.phoneNumber || "",
        specialization: instructor.specialization || "",
        isSpecialist: instructor.isSpecialist || false,
        departmentId: instructor.departmentId ? instructor.departmentId.toString() : "",
      });
    }
  }, [instructor, form]);

  const updateInstructorMutation = useMutation({
    mutationFn: (data: FormValues) => {
      if (!instructorId) return Promise.reject("No instructor ID provided");
      // Convert departmentId to number if provided
      const instructorData = {
        ...data,
        departmentId: data.departmentId ? parseInt(data.departmentId) : null,
      };
      return instructorsService.updateInstructor(instructorId, instructorData);
    },
    onSuccess: () => {
      toast.success("Instructor updated successfully");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", instructorId] });
      handleClose();
    },
    onError: (error) => {
      console.error("Error updating instructor:", error);
      toast.error("Failed to update instructor");
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    updateInstructorMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Instructor</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-4">Loading instructor data...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isSpecialist"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is Specialist</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {departments?.map((department) => (
                          <SelectItem 
                            key={department.id} 
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
