
import api from '@/lib/api';

export const enrollmentsService = {
  getStudentEnrollments: async (studentId: number) => {
    try {
      const response = await api.get(`/enrollments/student/${studentId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching enrollments for student ${studentId}:`, error);
      return [];
    }
  },

  getAllEnrollments: async () => {
    try {
      const response = await api.get('/enrollments');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching all enrollments:', error);
      return [];
    }
  },

  updateEnrollmentStatus: async (enrollmentId: number, status: string) => {
    try {
      const response = await api.patch(`/enrollments/${enrollmentId}`, { status });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating enrollment ${enrollmentId}:`, error);
      throw error;
    }
  },

  deleteEnrollment: async (enrollmentId: number) => {
    try {
      await api.delete(`/enrollments/${enrollmentId}`);
    } catch (error) {
      console.error(`Error deleting enrollment ${enrollmentId}:`, error);
      throw error;
    }
  }
};
