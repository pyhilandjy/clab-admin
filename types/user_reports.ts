export interface WordCounts {
  [word: string]: number;
}

export interface SpeakerData {
  speaker: string;
  word_counts: WordCounts;
}

export type WordcloudData = SpeakerData[];
