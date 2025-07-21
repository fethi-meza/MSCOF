import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Search } from "lucide-react";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import api from "@/lib/api";
import { Formation } from "@/types";
import { useAuth } from "@/lib/auth";

export default function FormationsPage() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("startDate");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const { data: formations, isLoading } = useQuery({
    queryKey: ["formations"],
    queryFn: async () => {
      const response = await api.get("/formations");
      return response.data.data as Formation[];
    },
  });

  // Default image for formations
  const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop";

  // Handle image error
  const handleImageError = (formationId: string) => {
    setImageErrors(prev => new Set(prev).add(formationId));
  };

  // Get image source with fallback
  const getImageSrc = (formation: Formation) => {
    if (imageErrors.has(formation.id) || !formation.image) {
      return defaultImage;
    }
    
    try {
      // Clean and validate URL
      const cleanUrl = formation.image.trim();
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      return defaultImage;
    }
  };

  // Filter and sort formations
  const filteredAndSortedFormations = formations
    ? formations
        .filter(
          (formation) =>
            formation.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (formation.description &&
              formation.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (formation.instructor &&
              `${formation.instructor.firstName} ${formation.instructor.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
          if (sortOption === "startDate") {
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          }
          if (sortOption === "name") {
            return a.name.localeCompare(b.name);
          }
          if (sortOption === "duration") {
            return a.durationInHours - b.durationInHours;
          }
          return 0;
        })
    : [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if formation is available
  const isFormationAvailable = (formation: Formation) => {
    const now = new Date();
    const startDate = new Date(formation.startDate);
    return (
      startDate > now &&
      (formation.remainingSpots === undefined || formation.remainingSpots > 0)
    );
  };

  // Check if a formation is ongoing
  const isFormationOngoing = (formation: Formation) => {
    const now = new Date();
    const startDate = new Date(formation.startDate);
    const endDate = new Date(formation.endDate);
    return startDate <= now && endDate >= now;
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Formations</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search formations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort select */}
          <Select
            defaultValue={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                {/* Image skeleton */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
                <CardHeader>
                  <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedFormations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedFormations.map((formation) => (
              <Card key={formation.id} className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
                {/* Formation Image */}
                <div className="aspect-video relative overflow-hidden bg-gray-200">
                  <img
                    src={getImageSrc(formation)}
                    alt={formation.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    onError={() => handleImageError(formation.id)}
                    loading="lazy"
                  />
                  {/* Status badge overlay */}
                  <div className="absolute top-2 right-2">
                    {isFormationAvailable(formation) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                        Available
                      </Badge>
                    ) : isFormationOngoing(formation) ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        Ongoing
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                        Upcoming
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{formation.name}</CardTitle>
                  <CardDescription>
                    {formation.instructor
                      ? `Instructor: ${formation.instructor.firstName} ${formation.instructor.lastName}`
                      : "Instructor to be assigned"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm line-clamp-2 mb-4">
                    {formation.description || "No description available."}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {formatDate(formation.startDate)} -{" "}
                        {formatDate(formation.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formation.durationInHours} hours</span>
                    </div>
                    {formation.schedules && formation.schedules.length > 0 && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formation.schedules[0].location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <Separator />
                <CardFooter className="pt-4">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {formation.remainingSpots !== undefined
                        ? `${formation.remainingSpots} spots left`
                        : `${formation.availableSpots} spots total`}
                    </span>
                    <Button asChild>
                      <Link to={`/formations/${formation.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No formations found</h3>
            <p className="text-muted-foreground mb-8">
              Try adjusting your search or check back later for new formations
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}