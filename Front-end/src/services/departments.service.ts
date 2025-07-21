
import api from '@/lib/api';
import { Department } from '@/types';

export const departmentsService = {
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return []; // Return empty array instead of undefined
    }
  },

  getDepartmentById: async (id: number) => {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching department with ID ${id}:`, error);
      throw error;
    }
  },

  createDepartment: async (departmentData: Partial<Department>) => {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  },

  updateDepartment: async (id: number, departmentData: Partial<Department>) => {
    try {
      const response = await api.patch(`/departments/${id}`, departmentData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating department with ID ${id}:`, error);
      throw error;
    }
  },

  deleteDepartment: async (id: number) => {
    try {
      await api.delete(`/departments/${id}`);
    } catch (error) {
      console.error(`Error deleting department with ID ${id}:`, error);
      throw error;
    }
  }
};
