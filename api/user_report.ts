import api from '@/lib/api';
import {
  WordcloudData,
  UserReportsInfo,
  SentenceLengthData,
} from '@/types/user_reports';

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
  console.log('userReportsId', userReportsId);
  console.log('wordcloudData', wordcloudData);
  console.log(typeof wordcloudData);

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

export const createWordCloud = async (userReportsId: string) => {
  try {
    const response = await api.post('/wordcloud/data', {
      user_reports_id: userReportsId,
    });

    return response.data;
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

export const createSentenceLength = async (userReportsId: string) => {
  try {
    const response = await api.post('/sentence_length/data', {
      user_reports_id: userReportsId,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating word cloud:', error);
    throw error;
  }
};

export const updateSentenceLength = async (
  userReportsId: string,
  sentence_length: SentenceLengthData,
): Promise<{ message: string }> => {
  try {
    const response = await api.patch<{ message: string }>(
      '/sentence_length/data',
      {
        user_reports_id: userReportsId,
        sentence_length_data: sentence_length,
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating sentence length data for ID ${userReportsId}:`,
      error,
    );
    throw error;
  }
};
