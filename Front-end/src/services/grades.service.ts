
import api from '@/lib/api';
import { Grade } from '@/types';

export const gradesService = {
  getAllGrades: async () => {
    try {
      const response = await api.get('/grades');
      console.log('Fetched all grades:', response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      return []; // Return empty array instead of undefined to prevent errors
    }
  },

  getGradeById: async (id: number) => {
    try {
      const response = await api.get(`/grades/${id}`);
      console.log(`Fetched grade ${id}:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error);
      throw error;
    }
  },

  createGrade: async (gradeData: Partial<Grade>) => {
    try {
      const response = await api.post('/grades', gradeData);
      console.log('Created grade:', response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating grade:", error);
      throw error;
    }
  },

  updateGrade: async (id: number, gradeData: Partial<Grade>) => {
    try {
      const response = await api.put(`/grades/${id}`, gradeData);
      console.log(`Updated grade ${id}:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating grade with ID ${id}:`, error);
      throw error;
    }
  },

  deleteGrade: async (id: number) => {
    try {
      await api.delete(`/grades/${id}`);
      console.log(`Deleted grade ${id}`);
    } catch (error) {
      console.error(`Error deleting grade with ID ${id}:`, error);
      throw error;
    }
  },
  
  getStudentGrades: async (studentId: number) => {
    try {
      const response = await api.get(`/students/${studentId}/grades`);
      console.log(`Fetched grades for student ${studentId}:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching grades for student with ID ${studentId}:`, error);
      return [];
    }
  }
};
