
// This file will contain API service functions to interact with the backend
// For now, we're using mock data, but this would be replaced with actual API calls

import { Student } from '@/components/students/StudentList';
import { Instructor } from '@/components/instructors/InstructorList';
import { Formation } from '@/components/formations/FormationList';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Student API
export const fetchStudents = async (): Promise<ApiResponse<Student[]>> => {
  // This would be a real API call in production
  // return await fetch('/api/students').then(res => res.json());
  
  // Mock implementation
  return {
    data: [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'ACTIVE', enrollmentDate: '2023-09-01' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', status: 'ACTIVE', enrollmentDate: '2023-09-01' },
      // Add more mock data as needed
    ],
    success: true
  };
};

export const createStudent = async (student: Omit<Student, 'id'>): Promise<ApiResponse<Student>> => {
  // This would be a real API call in production
  // return await fetch('/api/students', {
  //   method: 'POST',
  //   body: JSON.stringify(student),
  //   headers: { 'Content-Type': 'application/json' }
  // }).then(res => res.json());
  
  // Mock implementation
  return {
    data: {
      id: Math.floor(Math.random() * 1000),
      ...student
    },
    message: 'Student created successfully',
    success: true
  };
};

export const updateStudent = async (id: number, student: Partial<Student>): Promise<ApiResponse<Student>> => {
  // Mock implementation
  return {
    data: {
      id,
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      email: student.email || '',
      status: student.status || 'ACTIVE',
      enrollmentDate: student.enrollmentDate || ''
    },
    message: 'Student updated successfully',
    success: true
  };
};

// Instructor API
export const fetchInstructors = async (): Promise<ApiResponse<Instructor[]>> => {
  // Mock implementation
  return {
    data: [
      { 
        id: 1, 
        firstName: 'David', 
        lastName: 'Wilson', 
        email: 'david.wilson@example.com', 
        specialization: 'Mathematics',
        isSpecialist: true,
        departmentName: 'Science'
      },
      // Add more mock data as needed
    ],
    success: true
  };
};

export const createInstructor = async (instructor: Omit<Instructor, 'id'>): Promise<ApiResponse<Instructor>> => {
  // Mock implementation
  return {
    data: {
      id: Math.floor(Math.random() * 1000),
      ...instructor
    },
    message: 'Instructor created successfully',
    success: true
  };
};

// Formation API
export const fetchFormations = async (): Promise<ApiResponse<Formation[]>> => {
  // Mock implementation
  return {
    data: [
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
      // Add more mock data as needed
    ],
    success: true
  };
};

export const createFormation = async (formation: Omit<Formation, 'id'>): Promise<ApiResponse<Formation>> => {
  // Mock implementation
  return {
    data: {
      id: Math.floor(Math.random() * 1000),
      ...formation,
      totalSpots: formation.availableSpots // Assuming totalSpots equals availableSpots when first created
    },
    message: 'Formation created successfully',
    success: true
  };
};

// These functions would be expanded to include all necessary API calls
// for a complete application, including delete operations, fetching by ID, etc.
