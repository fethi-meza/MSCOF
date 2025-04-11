
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data
  const recentFormations = [
    { 
      id: 1, 
      name: 'Introduction to Programming', 
      startDate: '2025-05-10',
      availableSpots: 15,
      totalSpots: 30,
      instructorName: 'Sarah Johnson'
    },
    { 
      id: 2, 
      name: 'Advanced Mathematics', 
      startDate: '2025-05-15',
      availableSpots: 5,
      totalSpots: 25,
      instructorName: 'David Wilson'
    },
    { 
      id: 3, 
      name: 'Web Development Bootcamp', 
      startDate: '2025-06-01',
      availableSpots: 0,
      totalSpots: 20,
      instructorName: 'Amanda Garcia'
    },
  ];

  const recentStudents = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', date: '2025-04-01', status: 'ACTIVE' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', date: '2025-04-03', status: 'ACTIVE' },
    { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', date: '2025-04-05', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div>
          <Button>Generate Report</Button>
        </div>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Formations</CardTitle>
            <CardDescription>Newly added or upcoming formations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentFormations.map((formation) => {
                  const availabilityPercent = 
                    (formation.availableSpots / formation.totalSpots) * 100;
                  
                  let statusBadge;
                  if (formation.availableSpots === 0) {
                    statusBadge = <Badge className="bg-red-100 text-red-800">Full</Badge>;
                  } else if (availabilityPercent < 25) {
                    statusBadge = <Badge className="bg-amber-100 text-amber-800">Limited</Badge>;
                  } else {
                    statusBadge = <Badge className="bg-green-100 text-green-800">Open</Badge>;
                  }

                  return (
                    <TableRow key={formation.id}>
                      <TableCell className="font-medium">{formation.name}</TableCell>
                      <TableCell>{formation.instructorName}</TableCell>
                      <TableCell>{new Date(formation.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{statusBadge}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Newly enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary-100 text-primary-800">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(student.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {student.status.charAt(0) + student.status.slice(1).toLowerCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
