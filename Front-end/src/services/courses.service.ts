
import api from '@/lib/api';
import { Course } from '@/types';

export const coursesService = {
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return []; // Return empty array instead of undefined to prevent errors
    }
  },

  getCourseById: async (id: number) => {
    const response = await api.get(`/courses/${id}`);
    return response.data.data;
  },

  createCourse: async (courseData: Partial<Course>) => {
    const response = await api.post('/courses', courseData);
    return response.data.data;
  },

  updateCourse: async (id: number, courseData: Partial<Course>) => {
    const response = await api.patch(`/courses/${id}`, courseData);
    return response.data.data;
  },

  deleteCourse: async (id: number) => {
    await api.delete(`/courses/${id}`);
  }
};
