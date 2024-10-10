import { Mission } from './mission';

export interface Report {
  id: string;
  title: string;
  quant_analysis: string[];
  qual_analysis: string[];
  missions_id: string[];
}

export interface ReportAdd {
  title: string;
  quant_analysis: string[];
  qual_analysis: string[];
  missions_id: string[];
  planId?: string;
}

export interface ReportListProps {
  reports: Report[];
  missions: Mission[];
  isOpen: boolean;
  planId: string;
  onDeleteSuccess: (reportId: string) => void;
  onAddReport: () => Promise<void>;
}
