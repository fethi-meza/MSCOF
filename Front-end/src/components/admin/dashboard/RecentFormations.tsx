
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formationsService } from '@/services/formations.service';
import { Formation } from '@/types';

export const RecentFormations = () => {
  const { data: formations = [], isLoading } = useQuery({
    queryKey: ['formations'],
    queryFn: formationsService.getAllFormations
  });

  const recentFormations = formations.slice(0, 3); // Show only 3 most recent
  const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Recent Formations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recentFormations.length > 0 ? (
              recentFormations.map((formation: Formation) => (
                <div key={formation.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={formation.image || defaultImage} 
                        alt={formation.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = defaultImage;
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/formations/${formation.id}`} className="font-medium hover:underline">
                        {formation.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {new Date(formation.startDate).toLocaleDateString()} • {formation.remainingSpots} spots left
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No formations available.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
