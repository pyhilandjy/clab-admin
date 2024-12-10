import api from '@/lib/api';
import { WordcloudData } from '@/types/user_reports';

export const fetchWordCloudData = async (
  userReportsId: string,
): Promise<WordcloudData> => {
  try {
    const response = await api.get<WordcloudData>('/wordcloud/data', {
      params: { user_reports_id: userReportsId },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching word cloud data for ID ${userReportsId}:`,
      error,
    );
    throw error;
  }
};
