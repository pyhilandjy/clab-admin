import api from '@/lib/api';
import {
  FetchReportsResponse,
  ReportAudioFile,
} from '@/types/report-management';

export const fetchReports = async (
  currentPage: number,
  pageSize: number,
): Promise<FetchReportsResponse> => {
  try {
    const response = await api.get<FetchReportsResponse>(
      '/management/reports/list',
      {
        params: { page: currentPage, page_size: pageSize },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    throw error;
  }
};

export const fetchReportAudioFiles = async (
  userReportsId: string,
): Promise<ReportAudioFile[]> => {
  try {
    const response = await api.get<ReportAudioFile[]>(
      `/management/reports/audio_files/${userReportsId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch audio files:', error);
    throw error;
  }
};
