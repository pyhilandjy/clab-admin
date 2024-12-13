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
