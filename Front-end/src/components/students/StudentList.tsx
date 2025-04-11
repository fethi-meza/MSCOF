
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

export type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'GRADUATED' | 'DROPPED';
  enrollmentDate: string;
};

interface StudentListProps {
  onAddClick: () => void;
  onEditClick: (student: Student) => void;
  onViewClick: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ onAddClick, onEditClick, onViewClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - in a real app, this would come from an API
  const students: Student[] = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      status: 'ACTIVE',
      enrollmentDate: '2023-09-01'
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane.smith@example.com', 
      status: 'ACTIVE',
      enrollmentDate: '2023-09-01'
    },
    { 
      id: 3, 
      firstName: 'Robert', 
      lastName: 'Johnson', 
      email: 'robert.johnson@example.com', 
      status: 'GRADUATED',
      enrollmentDate: '2022-09-01'
    },
    { 
      id: 4, 
      firstName: 'Emily', 
      lastName: 'Williams', 
      email: 'emily.williams@example.com', 
      status: 'ACTIVE',
      enrollmentDate: '2023-09-01'
    },
    { 
      id: 5, 
      firstName: 'Michael', 
      lastName: 'Brown', 
      email: 'michael.brown@example.com', 
      status: 'DROPPED',
      enrollmentDate: '2022-09-01'
    }
  ];

  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'GRADUATED':
        return 'bg-blue-100 text-blue-800';
      case 'DROPPED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search students..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
                  </span>
                </TableCell>
                <TableCell>{new Date(student.enrollmentDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onViewClick(student)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditClick(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentList;
