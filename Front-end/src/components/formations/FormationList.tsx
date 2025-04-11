
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
import { PlusCircle, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export type Formation = {
  id: number;
  name: string;
  description: string;
  availableSpots: number;
  totalSpots: number;
  durationInHours: number;
  startDate: string;
  endDate: string;
  instructorName?: string;
};

interface FormationListProps {
  onAddClick: () => void;
  onEditClick: (formation: Formation) => void;
  onViewClick: (formation: Formation) => void;
  onManageSchedule: (formation: Formation) => void;
}

const FormationList: React.FC<FormationListProps> = ({ 
  onAddClick, 
  onEditClick, 
  onViewClick,
  onManageSchedule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - in a real app, this would come from an API
  const formations: Formation[] = [
    { 
      id: 1, 
      name: 'Introduction to Programming', 
      description: 'A beginner-friendly course on programming fundamentals',
      availableSpots: 15,
      totalSpots: 30,
      durationInHours: 40,
      startDate: '2025-05-10',
      endDate: '2025-06-30',
      instructorName: 'Sarah Johnson'
    },
    { 
      id: 2, 
      name: 'Advanced Mathematics', 
      description: 'Deep dive into calculus and linear algebra',
      availableSpots: 5,
      totalSpots: 25,
      durationInHours: 60,
      startDate: '2025-05-15',
      endDate: '2025-07-15',
      instructorName: 'David Wilson'
    },
    { 
      id: 3, 
      name: 'Web Development Bootcamp', 
      description: 'Comprehensive course on modern web development',
      availableSpots: 0,
      totalSpots: 20,
      durationInHours: 80,
      startDate: '2025-06-01',
      endDate: '2025-08-30',
      instructorName: 'Amanda Garcia'
    },
    { 
      id: 4, 
      name: 'Data Science Fundamentals', 
      description: 'Introduction to data analysis and visualization',
      availableSpots: 12,
      totalSpots: 25,
      durationInHours: 50,
      startDate: '2025-07-01',
      endDate: '2025-08-15',
      instructorName: 'Michael Brown'
    }
  ];

  const filteredFormations = formations.filter(formation => 
    formation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (formation.instructorName && 
     formation.instructorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAvailabilityColor = (available: number, total: number) => {
    if (available === 0) return 'bg-red-100 text-red-800';
    if (available < total * 0.2) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search formations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Formation
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFormations.map((formation) => (
              <TableRow key={formation.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{formation.name}</div>
                    <div className="text-xs text-muted-foreground">{formation.description}</div>
                  </div>
                </TableCell>
                <TableCell>{formation.instructorName || 'Not assigned'}</TableCell>
                <TableCell>{formation.durationInHours} hours</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{new Date(formation.startDate).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">to</div>
                    <div>{new Date(formation.endDate).toLocaleDateString()}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>
                        <Badge 
                          className={getAvailabilityColor(formation.availableSpots, formation.totalSpots)}
                        >
                          {formation.availableSpots} spots left
                        </Badge>
                      </span>
                      <span className="text-muted-foreground">
                        {formation.totalSpots - formation.availableSpots}/{formation.totalSpots}
                      </span>
                    </div>
                    <Progress 
                      value={((formation.totalSpots - formation.availableSpots) / formation.totalSpots) * 100} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onViewClick(formation)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEditClick(formation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onManageSchedule(formation)}>
                    <Calendar className="h-4 w-4 text-primary-600" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredFormations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No formations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FormationList;
