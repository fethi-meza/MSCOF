
import { Link } from 'react-router-dom';
import { Calendar, Clock, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface EnrollmentCardProps {
  enrollment: any;
  onDeleteEnrollment: (enrollmentId: number) => void;
}

export function EnrollmentCard({ enrollment, onDeleteEnrollment }: EnrollmentCardProps) {
  const formation = enrollment.formation;
  const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop";

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

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

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-gray-200">
        <img
          src={formation.image || defaultImage}
          alt={formation.name}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(enrollment.status)}>
            {enrollment.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{formation.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(formation.startDate)} - {formatDate(formation.endDate)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {formation.description || 'No description available.'}
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formation.durationInHours} hours</span>
          </div>
          {formation.instructor && (
            <span className="text-muted-foreground">
              {formation.instructor.firstName} {formation.instructor.lastName}
            </span>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Enrolled: {formatDate(enrollment.enrollmentDate)}
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/formations/${formation.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </Button>
          
          {enrollment.status === 'ACTIVE' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Unenroll
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Unenrollment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unenroll from "{formation.name}"? 
                    This action cannot be undone and you may lose your progress.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteEnrollment(enrollment.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Unenroll
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
