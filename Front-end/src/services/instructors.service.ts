
import api from '@/lib/api';
import { Instructor } from '@/types';

export const instructorsService = {
  getAllInstructors: async () => {
    try {
      const response = await api.get('/instructors');
      console.log('Fetched instructors:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching instructors:", error);
      return []; 
    }
  },

  getInstructorById: async (id: number) => {
    try {
      const response = await api.get(`/instructors/${id}`);
      console.log(`Fetched instructor ${id}:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching instructor with ID ${id}:`, error);
      throw error;
    }
  },

  createInstructor: async (instructorData: any) => {
    try {
      // Make sure departmentId is properly formatted
      const formattedData = {
        ...instructorData,
        departmentId: instructorData.departmentId && instructorData.departmentId !== "" 
          ? parseInt(String(instructorData.departmentId)) 
          : null
      };
      
      console.log("Sending instructor data to API:", formattedData);
      
      // Use the auth register endpoint for new instructors
      const response = await api.post('/auth/register/instructor', formattedData);
      console.log('Created instructor response:', response.data);
      
      // Return the instructor data from the response - handle different response structures
      return response.data?.data || response.data?.instructor || response.data;
    } catch (error) {
      console.error("Error creating instructor:", error);
      // Log more details about the error
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw error;
    }
  },

  updateInstructor: async (id: number, instructorData: Partial<Instructor>) => {
    try {
      // Make sure departmentId is properly formatted if it exists
      const formattedData = { 
        ...instructorData,
        departmentId: instructorData.departmentId !== undefined && String(instructorData.departmentId) !== "" 
          ? parseInt(String(instructorData.departmentId)) 
          : null
      };
      
      console.log(`Updating instructor ${id} with data:`, formattedData);
      
      const response = await api.patch(`/instructors/${id}`, formattedData);
      console.log(`Updated instructor ${id}:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating instructor with ID ${id}:`, error);
      throw error;
    }
  },

  deleteInstructor: async (id: number) => {
    try {
      await api.delete(`/instructors/${id}`);
      console.log(`Deleted instructor ${id}`);
    } catch (error) {
      console.error(`Error deleting instructor with ID ${id}:`, error);
      throw error;
    }
  }
};