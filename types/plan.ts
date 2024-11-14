export type Plan = {
  id: string;
  plan_name: string;
  price: number | null;
  start_age_month: number | null;
  end_age_month: number | null;
  day: number | null;
  description: string;
  type: string;
  tags: string[];
  category_id: string;
  status?: string;
};

export type Category = {
  id: string;
  name: string;
  parent_id?: string;
  sub_categories?: Category[];
};

export type UpdatePlanPayload = {
  id: string;
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

export type CreatePlanPayload = {
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
