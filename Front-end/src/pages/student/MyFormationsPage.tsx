
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/student/formations/PageHeader';
import { LoadingSkeleton } from '@/components/student/formations/LoadingSkeleton';
import { EmptyEnrollmentsCard } from '@/components/student/formations/EmptyEnrollmentsCard';
import { EnrollmentCard } from '@/components/student/formations/EnrollmentCard';
import { useStudentEnrollments } from '@/hooks/useStudentEnrollments';

export default function MyFormationsPage() {
  const { enrollments, isLoading, handleDeleteEnrollment } = useStudentEnrollments();

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <PageHeader />

        {isLoading ? (
          <LoadingSkeleton />
        ) : enrollments.length === 0 ? (
          <EmptyEnrollmentsCard />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                onDeleteEnrollment={handleDeleteEnrollment}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
