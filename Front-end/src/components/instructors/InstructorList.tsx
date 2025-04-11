
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  isSpecialist: boolean;
  departmentName?: string;
};

interface InstructorListProps {
  onAddClick: () => void;
  onEditClick: (instructor: Instructor) => void;
  onViewClick: (instructor: Instructor) => void;
}

const InstructorList: React.FC<InstructorListProps> = ({ onAddClick, onEditClick, onViewClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - in a real app, this would come from an API
  const instructors: Instructor[] = [
    { 
      id: 1, 
      firstName: 'David', 
      lastName: 'Wilson', 
      email: 'david.wilson@example.com', 
      specialization: 'Mathematics',
      isSpecialist: true,
      departmentName: 'Science'
    },
    { 
      id: 2, 
      firstName: 'Sarah', 
      lastName: 'Johnson', 
      email: 'sarah.johnson@example.com', 
      specialization: 'Computer Science',
      isSpecialist: true,
      departmentName: 'Technology'
    },
    { 
      id: 3, 
      firstName: 'Michael', 
      lastName: 'Brown', 
      email: 'michael.brown@example.com', 
      specialization: 'Literature',
      isSpecialist: false,
      departmentName: 'Humanities'
    },
    { 
      id: 4, 
      firstName: 'Amanda', 
      lastName: 'Garcia', 
      email: 'amanda.garcia@example.com', 
      specialization: 'Physics',
      isSpecialist: true,
      departmentName: 'Science'
    },
    { 
      id: 5, 
      firstName: 'James', 
      lastName: 'Martinez', 
      email: 'james.martinez@example.com', 
      specialization: 'History',
      isSpecialist: false,
      departmentName: 'Humanities'
    }
  ];

  const filteredInstructors = instructors.filter(instructor => 
    instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search instructors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Instructor
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialist</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <TableCell className="font-medium">{instructor.firstName} {instructor.lastName}</TableCell>
                <TableCell>{instructor.email}</TableCell>
                <TableCell>{instructor.specialization}</TableCell>
                <TableCell>{instructor.departmentName || 'N/A'}</TableCell>
                <TableCell>
                  {instructor.isSpecialist ? (
                    <Badge className="bg-primary-100 text-primary-800 hover:bg-primary-100">Specialist</Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onViewClick(instructor)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditClick(instructor)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredInstructors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No instructors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InstructorList;
