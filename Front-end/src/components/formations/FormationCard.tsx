
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Formation } from "@/types";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface FormationCardProps {
  formation: Formation;
}

export function FormationCard({ formation }: FormationCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop";

  console.log('Formation image:', formation.image);

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden bg-gray-200">
        <img 
          src={formation.image || defaultImage}
          alt={formation.name} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            console.log('Image error, falling back to default');
            (e.target as HTMLImageElement).src = defaultImage;
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{formation.name}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>
            {formatDate(formation.startDate)} - {formatDate(formation.endDate)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {formation.description || "No description available."}
        </p>
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formation.durationInHours} hours</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {formation.remainingSpots !== undefined 
                ? `${formation.remainingSpots} spots left` 
                : `${formation.availableSpots} spots`}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/formations/${formation.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
