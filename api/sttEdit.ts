import api from '@/lib/api';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type SttData = {
  id: string;
  audio_files_id: string;
  text_order: number;
  text_edited: string;
  speaker: string;
  act_id: number;
  talk_more_id: number;
  act_types_id: number;
};

export type SpeechAct = {
  act_name: string;
  id: number;
};

export type TalkMore = {
  talk_more: string;
  id: number;
};

export type ActTypes = {
  act_type: string;
  id: number;
};

export type file = {
  id: string;
};

export const fetchUser = () => api.get<User>(`/users/`);
export const fetchSpeechAct = () => api.get<SpeechAct>(`/stt/speech_acts/`);
export const fetchTalkMore = () => api.get<TalkMore>(`/stt/tack_more/`);
export const fetchActTypes = () => api.get<ActTypes>(`/stt/act_types/`);

// export const fetchCategories = () => api.get<Category[]>('/categories/');

// export const createPlan = (plan: Plan) => api.post<Plan>('/plans/', plan);

// export const updatePlan = (planId: string, plan: Plan) =>
//   api.put<Plan>(`/plans/${planId}`, plan);
