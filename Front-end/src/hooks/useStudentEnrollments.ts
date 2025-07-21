
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { enrollmentsService } from '@/services/enrollments.service';
import { useAuth } from '@/lib/auth';

export function useStudentEnrollments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['student-enrollments', user?.id],
    queryFn: () => enrollmentsService.getStudentEnrollments(user?.id!),
    enabled: !!user?.id,
  });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: enrollmentsService.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      toast({
        title: 'Enrollment deleted',
        description: 'You have been unenrolled from the formation.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete enrollment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleDeleteEnrollment = (enrollmentId: number) => {
    deleteEnrollmentMutation.mutate(enrollmentId);
  };

  return {
    enrollments,
    isLoading,
    handleDeleteEnrollment,
  };
}
