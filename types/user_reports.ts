export type UserReportsInfo = {
  user_id: string;
  title: string;
  plan_name: string;
  first_name: string;
  user_name: string;
};

export interface WordCounts {
  [word: string]: number;
}

export interface WordcloudSpeakerData {
  speaker: string;
  word_counts: WordCounts;
}

export type WordcloudData = {
  data: WordcloudSpeakerData[];
  insights: string;
};

export interface SentenceLengthStatistics {
  [word: string]: number;
}

export interface TokenziedSpeakerData {
  speaker: string;
  char_lengths: [];
  statistical_data: SentenceLengthStatistics;
}

export type SentenceLengthData = {
  data: TokenziedSpeakerData[];
  insights: string;
};

export interface PosRatio {
  [word: string]: number;
}

export interface PosRatioSpeakerData {
  speaker: string;
  pos_ratio_data: PosRatio;
}

export type PosRatioData = {
  data: PosRatioSpeakerData[];
  insights: string;
};

export interface SpeechActMoodData {
  [act_name: string]: number;
}

export interface SpeechAct {
  [mood: string]: SpeechActMoodData;
}

export interface SpeechActSpeakerData {
  speaker: string;
  speech_act: SpeechAct[];
}

export interface SpeechActData {
  data: SpeechActSpeakerData[];
  insights: string | null;
}

export type InsightData = {
  id: string;
  text: string[];
  title: string;
  insight: string;
  example?: string;
  created_at: string;
  user_reports_id: string;
  reports_order: number;
};
