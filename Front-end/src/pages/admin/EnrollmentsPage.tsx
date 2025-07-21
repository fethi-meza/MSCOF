
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Check, X, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { enrollmentsService } from '@/services/enrollments.service';
import { format } from 'date-fns';

export default function EnrollmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['all-enrollments'],
    queryFn: enrollmentsService.getAllEnrollments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ enrollmentId, status }: { enrollmentId: number; status: string }) =>
      enrollmentsService.updateEnrollmentStatus(enrollmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-enrollments'] });
      toast.success('Enrollment status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update enrollment status');
    },
  });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: enrollmentsService.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-enrollments'] });
      toast.success('Enrollment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete enrollment');
    },
  });

  const handleApprove = (enrollmentId: number) => {
    updateStatusMutation.mutate({ enrollmentId, status: 'ACTIVE' });
  };

  const handleReject = (enrollmentId: number) => {
    updateStatusMutation.mutate({ enrollmentId, status: 'CANCELLED' });
  };

  const handleDelete = (enrollmentId: number) => {
    deleteEnrollmentMutation.mutate(enrollmentId);
  };

  const filteredEnrollments = enrollments.filter((enrollment: any) =>
    enrollment.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.formation?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Enrollments</h1>
            <p className="text-muted-foreground">
              Manage student enrollments and approval status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Enrollments</CardDescription>
              <CardTitle className="text-4xl font-bold">{enrollments.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600">
                {enrollments.filter((e: any) => e.status === 'ACTIVE').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600">
                {enrollments.filter((e: any) => e.status === 'COMPLETED').length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cancelled</CardDescription>
              <CardTitle className="text-4xl font-bold text-red-600">
                {enrollments.filter((e: any) => e.status === 'CANCELLED').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
            <CardDescription>View and manage student enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by student name or formation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Formation</TableHead>
                    <TableHead>Enrollment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading enrollments...
                      </TableCell>
                    </TableRow>
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No enrollments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((enrollment: any) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {enrollment.student?.firstName} {enrollment.student?.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {enrollment.student?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{enrollment.formation?.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(enrollment.formation?.startDate)} - {formatDate(enrollment.formation?.endDate)}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(enrollment.status)}>
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {enrollment.status !== 'ACTIVE' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(enrollment.id)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {enrollment.status === 'ACTIVE' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(enrollment.id)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(enrollment.id)}
                              disabled={deleteEnrollmentMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
