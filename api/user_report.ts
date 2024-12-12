import api from '@/lib/api';
import { WordcloudData, UserReportsInfo } from '@/types/user_reports';

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

export const updateWordCloudData = async (
  userReportsId: string,
  wordcloudData: WordcloudData,
): Promise<{ message: string }> => {
  try {
    const response = await api.patch<{ message: string }>('/wordcloud/data', {
      user_reports_id: userReportsId,
      wordcloud_data: wordcloudData,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating word cloud data for ID ${userReportsId}:`,
      error,
    );
    throw error;
  }
};

export const createWordCloud = async (userReportsId: string): Promise<void> => {
  try {
    await api.post('/wordcloud/data', {
      user_reports_id: userReportsId,
    });
  } catch (error) {
    console.error('Error creating word cloud:', error);
    throw error;
  }
};

export const fetchUserReportsInfo = async (
  userReportsId: string,
): Promise<UserReportsInfo> => {
  try {
    const response = await api.get<UserReportsInfo>('/user_reports/info', {
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
