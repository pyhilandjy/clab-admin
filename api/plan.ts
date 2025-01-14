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

export const uploadDescriptionImage = (
  planId: string,
  description_image_name: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append('description_image_name', description_image_name);
  formData.append('image', image);
  return api.patch(`/plans/${planId}/description/image`, formData);
};

export const uploadThumbnailImage = (
  planId: string,
  thumbnail_image_name: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append('thumbnail_image_name', thumbnail_image_name);
  formData.append('image', image);
  return api.patch(`/plans/${planId}/thumbnail/image`, formData);
};

export const uploadScheduleImage = (
  planId: string,
  schedule_image_name: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append('schedule_image_name', schedule_image_name);
  formData.append('image', image);
  return api.patch(`/plans/${planId}/schedule/image`, formData);
};

//plan/add.tsx
export const fetchMainCategories = () =>
  api.get<Category[]>('/categories/main/');

export const fetchSubCategories = (mainCategoryId: string) =>
  api.get(`/categories/sub/${mainCategoryId}`);

export const createPlan = (formData: FormData) =>
  api.post<Plan>('/plans/', formData);

export const fetchPlan = (planId: string) => api.get<Plan>(`/plans/${planId}`);

export const fetchCategories = () => api.get<Category[]>('/categories/');

export const updatePlan = (planId: string, plan: Plan) =>
  api.put<Plan>(`/plans/${planId}`, plan);
