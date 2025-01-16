export interface Report {
  user_reports_id: string;
  user_id: string;
  user_name: string;
  send_at: string;
  status: string;
  inspection: string;
  inspector: string;
  child_name: string;
  report_title: string;
  plans_name: string;
  inspected_at: string;
  audio_file_count: number;
  total_record_time: number;
  mission_progress: string;
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
  is_used: boolean;
  is_edited: boolean;
  edited_at: string;
}
