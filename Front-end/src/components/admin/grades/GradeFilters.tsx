
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from "@/types";

interface GradeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  courseFilter: string;
  onCourseFilterChange: (value: string) => void;
  courses?: Course[];
}

export function GradeFilters({
  searchTerm,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  courses
}: GradeFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by student name or email..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={courseFilter}
        onValueChange={onCourseFilterChange}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filter by course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Courses</SelectItem>
          {courses?.map((course) => (
            <SelectItem key={course.id} value={course.id.toString()}>
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
