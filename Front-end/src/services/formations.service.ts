
import api from '@/lib/api';
import { Formation } from '@/types';

export const formationsService = {
  getAllFormations: async () => {
    try {
      const response = await api.get('/formations');
      console.log('Formations API response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching formations:", error);
      return [];
    }
  },

  getFormationById: async (id: number) => {
    try {
      const response = await api.get(`/formations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching formation ${id}:`, error);
      throw error;
    }
  },

  createFormation: async (formationData: Partial<Formation>) => {
    try {
      const response = await api.post('/formations', formationData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating formation:", error);
      throw error;
    }
  },

  updateFormation: async (id: number, formationData: Partial<Formation>) => {
    try {
      const response = await api.patch(`/formations/${id}`, formationData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating formation ${id}:`, error);
      throw error;
    }
  },

  deleteFormation: async (id: number) => {
    try {
      await api.delete(`/formations/${id}`);
    } catch (error) {
      console.error(`Error deleting formation ${id}:`, error);
      throw error;
    }
  }
};
