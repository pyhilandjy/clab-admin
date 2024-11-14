import { Mission } from './mission';

export interface ReportWithMissions {
  report: {
    id: string;
    title: string;
    wordcloud: boolean;
    sentence_length: boolean;
    pos_ratio: boolean;
    speech_act: boolean;
    insight: boolean;
  };
  missions: Mission[];
}

export interface ReportAdd {
  report: {
    title: string;
    wordcloud: boolean;
    sentence_length: boolean;
    pos_ratio: boolean;
    speech_act: boolean;
    insight: boolean;
  };
  missions: { id: string }[];
}

export interface ReportListProps {
  reports: ReportWithMissions[];
  missions: Mission[];
  isOpen: boolean;
  planId: string;
  onDeleteSuccess: (reportId: string) => void;
  onAddReport: () => Promise<void>;
}
