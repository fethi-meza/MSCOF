
import api from '@/lib/api';
import { Student } from '@/types';

export const studentsService = {
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      return []; // Return empty array instead of undefined to prevent errors
    }
  },

  getStudentById: async (id: number) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },

  updateStudent: async (id: number, studentData: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data.data;
  },

  deleteStudent: async (id: number) => {
    await api.delete(`/students/${id}`);
  },

  getStudentFormations: async (id: number) => {
    const response = await api.get(`/students/${id}/formations`);
    return response.data.data;
  },

  getStudentGrades: async (id: number) => {
    const response = await api.get(`/students/${id}/grades`);
    return response.data.data;
  },
  
  createStudent: async (studentData: Partial<Student>) => {
    const response = await api.post(`/auth/register/student`, studentData);
    return response.data.data;
  }
};
