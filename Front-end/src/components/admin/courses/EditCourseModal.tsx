
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { coursesService } from "@/services/courses.service";
import api from "@/lib/api";

interface EditCourseModalProps {
  courseId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters."),
  description: z.string().optional(),
  departmentId: z.string().min(1, "Department is required."),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function EditCourseModal({ courseId, isOpen, onClose }: EditCourseModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const response = await api.get('/departments');
      return response.data.data;
    },
    enabled: isOpen,
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      departmentId: "",
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const data = await coursesService.getCourseById(courseId);
        form.reset({
          name: data.name,
          description: data.description || "",
          departmentId: data.departmentId.toString(),
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && courseId) {
      fetchCourse();
    }
  }, [courseId, isOpen, form]);

  const onSubmit = async (data: CourseFormValues) => {
    if (!courseId) return;
    setSubmitting(true);
    
    try {
      const courseData = {
        ...data,
        departmentId: parseInt(data.departmentId),
      };
      
      await coursesService.updateCourse(courseId, courseData);
      toast.success("Course updated successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      onClose();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading course data...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        className="min-h-24"
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
                        {departments.map((department) => (
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

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
