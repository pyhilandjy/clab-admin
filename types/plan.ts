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
  schedule?: string | null;
  summary?: string | null;
  description_image_name?: string | null;
  description_image_id_url?: string | null;
  schedule_image_name?: string | null;
  schedule_image_id_url?: string | null;
  thumbnail_image_name?: string | null;
  thumbnail_image_id_url?: string | null;
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
  schedule?: string | null;
  summary?: string | null;
};
