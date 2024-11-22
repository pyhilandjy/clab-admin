export interface Report {
  user_reports_id: string;
  user_id: string;
  user_name: string;
  send_at: string;
  status: string;
  inspection: string;
  child_name: string;
  report_title: string;
  plans_name: string;
}

export interface FetchReportsResponse {
  reports: Report[];
  total_pages: number;
}

export interface ReportAudioFile {
  audio_file_id: string;
  record_date: string;
  record_time: number;
  mission_title: string;
  is_use: boolean;
}
