export interface WordCounts {
  [word: string]: number;
}

export interface SpeakerData {
  speaker: string;
  word_counts: WordCounts;
}

export type WordcloudData = {
  data: SpeakerData[];
  insights: string;
};

export type UserReportsInfo = {
  user_id: string;
  title: string;
  plan_name: string;
  first_name: string;
  user_name: string;
};
