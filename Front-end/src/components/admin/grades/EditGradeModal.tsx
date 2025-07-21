
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { gradesService } from "@/services/grades.service";

interface EditGradeModalProps {
  gradeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const gradeSchema = z.object({
  value: z.coerce.number()
    .min(0, "Grade must be at least 0.")
    .max(100, "Grade must not exceed 100."),
  date: z.date({
    required_error: "Date is required.",
  }),
});

type GradeFormValues = z.infer<typeof gradeSchema>;

export function EditGradeModal({ gradeId, isOpen, onClose }: EditGradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      value: 0,
      date: new Date(),
    },
  });

  useEffect(() => {
    const fetchGrade = async () => {
      if (!gradeId) return;
      
      setLoading(true);
      try {
        const data = await gradesService.getGradeById(gradeId);
        setCurrentGrade(data);
        form.reset({
          value: data.value,
          date: new Date(data.date),
        });
      } catch (error) {
        console.error("Error fetching grade:", error);
        toast.error("Failed to load grade data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && gradeId) {
      fetchGrade();
    }
  }, [gradeId, isOpen, form]);

  const onSubmit = async (data: GradeFormValues) => {
    if (!gradeId) return;
    setSubmitting(true);
    
    try {
      await gradesService.updateGrade(gradeId, {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      });
      
      toast.success("Grade updated successfully");
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      onClose();
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Failed to update grade");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Grade</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">Loading grade data...</div>
        ) : currentGrade ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Student</p>
              <p className="font-medium mb-4">
                {currentGrade.student?.firstName} {currentGrade.student?.lastName}
              </p>
              
              <p className="text-sm text-muted-foreground mb-1">Course</p>
              <p className="font-medium mb-4">
                {currentGrade.course?.name || `Course #${currentGrade.courseId}`}
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Value (0-100)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setDateOpen(false);
                            }}
                            disabled={(date) =>
                              date > new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
          </>
        ) : (
          <div className="text-center py-6">Grade not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
