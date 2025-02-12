import api from '@/lib/api';
import { UserPlan } from '@/types/user_plans';

export const deleteUserPlan = async (
  userPlansId: string,
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      `/user_plans/${encodeURIComponent(userPlansId)}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting user plan with ID ${userPlansId}:`, error);
    throw error;
  }
};

export const fetchUserPlans = async (): Promise<UserPlan[]> => {
  try {
    const response = await api.get<UserPlan[]>('/user_plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching user plans:', error);
    throw error;
  }
};
