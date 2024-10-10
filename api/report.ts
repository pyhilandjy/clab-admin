import api from '@/lib/api';
import { Report, ReportAdd } from '@/types/report';

export const fetchReports = (planId: string) => {
  return api.get(`/reports/${planId}`);
};

export const deleteReport = (reportId: string) => {
  return api.delete(`/reports/${reportId}`);
};

export const addReport = (
  planId: string,
  reportData: Omit<ReportAdd, 'plan_id'>,
) => {
  return api.post(`/reports/${planId}`, reportData);
};

export const updateReport = (
  reportId: string,
  reportData: Omit<Report, 'id'>,
) => {
  return api.put(`/reports/${reportId}`, reportData);
};
