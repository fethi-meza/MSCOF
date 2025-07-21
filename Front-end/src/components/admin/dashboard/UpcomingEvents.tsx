
import { Link } from "react-router-dom";
import { Calendar, CalendarClock } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UpcomingEvents = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4 py-1">
            <p className="font-medium">Formation Start: Web Development</p>
            <p className="text-sm text-muted-foreground">Tomorrow, 9:00 AM</p>
          </div>
          <div className="border-l-4 border-orange-400 pl-4 py-1">
            <p className="font-medium">Instructor Meeting</p>
            <p className="text-sm text-muted-foreground">
              Wed, 2:00 PM - 3:00 PM
            </p>
          </div>
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <p className="font-medium">End of Semester</p>
            <p className="text-sm text-muted-foreground">
              July 15, 2023
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/admin/calendar">
              <CalendarClock className="mr-2 h-4 w-4" />
              View Full Calendar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
