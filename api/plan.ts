import api from '@/lib/api';

export type Category = {
  id: string;
  name: string;
  parent_id?: string;
  sub_categories?: Category[];
};

export type Plan = {
  id?: string;
  plan_name: string;
  price: number | null;
  start_age_month: number | null;
  end_age_month: number | null;
  day: number | null;
  description: string;
  type: string;
  tags: string[];
  category_id: string;
};

export const fetchPlan = (planId: string) => api.get<Plan>(`/plans/${planId}`);

export const fetchCategories = () => api.get<Category[]>('/categories/');

export const createPlan = (plan: Plan) => api.post<Plan>('/plans/', plan);

export const updatePlan = (planId: string, plan: Plan) =>
  api.put<Plan>(`/plans/${planId}`, plan);
