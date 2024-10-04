import api from '@/lib/api';
import { Mission } from '@/types/mission';
import { Category, Plan } from '@/types/plan';

//plan.tsx
export const fetchPlans = () => api.get<Plan[]>('/plans/');

export const fetchMission = (planId: string) =>
  api.get<Mission[]>(`/missions/${planId}`);

export const updatePlanStatus = (planId: string, status: string) =>
  api.patch(`/plans/${planId}/status/`, { status });

export const deletePlan = (planId: string) => api.delete(`/plans/${planId}`);

//plan/add.tsx
export const fetchMainCategories = () =>
  api.get<Category[]>('/categories/main/');

export const fetchSubCategories = (mainCategoryId: string) =>
  api.get(`/categories/sub/${mainCategoryId}`);

export const createPlan = (payload: any) => api.post<Plan>('/plans/', payload);

export const fetchPlan = (planId: string) => api.get<Plan>(`/plans/${planId}`);

export const fetchCategories = () => api.get<Category[]>('/categories/');

export const updatePlan = (planId: string, plan: Plan) =>
  api.put<Plan>(`/plans/${planId}`, plan);
