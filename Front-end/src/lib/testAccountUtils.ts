
import api from './api';
import { toast } from '@/components/ui/sonner';

export const seedTestAccounts = async () => {
  try {
    const response = await api.post('http://localhost:4002/api/auth/seed-test-accounts' );
    
    if (response.data.status === 'success') {
      toast.success('Test Accounts Created', {
        description: 'Student and Admin test accounts have been created successfully.'
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error seeding test accounts:', error);
    
    // Provide a more specific error message
    let errorMessage = 'There was an error creating test accounts.';
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error: Cannot connect to the backend server. Please make sure the server is running.';
    } else if (error.response) {
      errorMessage = `Server error: ${error.response.data?.message || error.response.statusText}`;
    }
    
    toast.error('Failed to Create Test Accounts', {
      description: errorMessage
    });
    
    throw error;
  }
};
