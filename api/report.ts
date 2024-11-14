import { AxiosResponse } from 'axios';

import api from '@/lib/api';
import { ReportWithMissions, ReportAdd } from '@/types/report';

export const fetchReports = async (
  planId: string,
): Promise<ReportWithMissions[]> => {
  const response: AxiosResponse<ReportWithMissions[]> = await api.get(
    `/reports/${planId}`,
  );
  return response.data;
};

export const deleteReport = async (reportId: string): Promise<void> => {
  await api.delete(`/reports/${reportId}`);
};

export const addReport = (planId: string, reportData: ReportAdd) => {
  const missions_id = reportData.missions.map((mission) => ({
    id: mission.id,
  }));
  return api.post(`/reports/${planId}`, { ...reportData.report, missions_id });
};

export const updateReport = async (
  reportId: string,
  reportData: ReportAdd & { id: string },
): Promise<void> => {
  const missions_id = reportData.missions.map((mission) => mission.id);
  await api.put(`/reports/${reportId}`, { ...reportData, missions_id });
};
