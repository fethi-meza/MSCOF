
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { departmentsService } from "@/services/departments.service";
import { formationsService } from "@/services/formations.service";

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  description: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  formationId: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      departmentId: "",
      formationId: "",
    },
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: departmentsService.getAllDepartments,
    enabled: isOpen,
  });

  const { data: formations = [], isLoading: formationsLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: formationsService.getAllFormations,
    enabled: isOpen,
  });

  const addCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      console.log("Submitting course data:", data);
      const response = await api.post("/courses", {
        ...data,
        departmentId: parseInt(data.departmentId),
        formationId: data.formationId && data.formationId !== "" ? parseInt(data.formationId) : null,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      console.error("Error creating course:", error);
      const errorMessage = error.response?.data?.message || "Failed to create course";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    setIsSubmitting(true);
    addCourseMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course name" {...field} />
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
                    <Textarea
                      placeholder="Enter course description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select a department"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department: any) => (
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

            <FormField
              control={form.control}
              name="formationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={formationsLoading ? "Loading formations..." : "Select a formation"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {formations.map((formation: any) => (
                        <SelectItem
                          key={formation.id}
                          value={formation.id.toString()}
                        >
                          {formation.name}
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
              <Button type="submit" disabled={isSubmitting || departmentsLoading || formationsLoading}>
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
