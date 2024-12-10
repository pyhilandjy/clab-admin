import api from '@/lib/api';
import { WordcloudData } from '@/types/user_reports';

export const fetchWordCloudData = () =>
  api.get<WordcloudData[]>('/wordcloud/data');
