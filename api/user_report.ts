import api from '@/lib/api';
import {
  WordcloudData,
  UserReportsInfo,
  SentenceLengthData,
  PosRatioData,
  SpeechActData,
  InsightData,
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

export const createPosRatio = async (userReportsId: string) => {
  try {
    const response = await api.post('/pos_ratio/data', {
      user_reports_id: userReportsId,
    });
    console.log('response', response);

    return response.data;
  } catch (error) {
    console.error('Error creating word cloud:', error);
    throw error;
  }
};

export const updatePosratio = async (
  userReportsId: string,
  posRatioData: PosRatioData,
): Promise<{ message: string }> => {
  try {
    const response = await api.patch<{ message: string }>('/pos_ratio/data', {
      user_reports_id: userReportsId,
      pos_ratio_data: posRatioData,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating POS Ratio data for ID ${userReportsId}:`,
      error,
    );
    throw error;
  }
};

export const createSpeechAct = async (userReportsId: string) => {
  try {
    const response = await api.post('/speech_act/data', {
      user_reports_id: userReportsId,
    });
    console.log('response', response);

    return response.data;
  } catch (error) {
    console.error('Error creating word cloud:', error);
    throw error;
  }
};

export const updateSpeechAct = async (
  userReportsId: string,
  speechActData: SpeechActData,
): Promise<{ message: string }> => {
  try {
    const response = await api.patch<{ message: string }>('/speech_act/data', {
      user_reports_id: userReportsId,
      speech_act_data: speechActData,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating Speech Act data for ID ${userReportsId}:`,
      error,
    );
    throw error;
  }
};

export const fetchInsightData = async (
  userReportsId: string,
): Promise<InsightData[]> => {
  try {
    const response = await api.get<InsightData[]>('insight/data', {
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

export const upsertInsightData = async (
  insightData: InsightData,
): Promise<{ message: string }> => {
  try {
    const response = await api.put<{ message: string }>(
      '/insight/data',
      insightData,
    );
    return response.data;
  } catch (error) {
    console.error('Error upserting insight data:', error);
    throw error;
  }
};

//수정 필요 body에 user_reports_id를 넣을 경우 422 에러 발생 type missing error
export const regenerateReport = async (userReportsId: string) => {
  try {
    const response = await api.post(
      `/reports/regenerate/${encodeURIComponent(userReportsId)}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error regenerating report:');
    throw error;
  }
};
