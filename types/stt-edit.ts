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
  is_turn: boolean;
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

export type AudioFiles = {
  id: string;
  file_name: string;
  status: string;
};

export type Quaritative = {
  stt_data_id: string;
  mood: string;
  description: string;
  alternative?: string;
  expection: string;
};

export type AudioInfos = {
  record_time: string;
  mission_title: string;
  created_at: string;
  first_name: string;
};
