import api from '@/lib/api';
import { MissionAdd } from '@/types/mission';

// 미션 추가 API (status 제거)
export const addMission = (planId: string, missionData: MissionAdd) =>
  api.post(`/missions/${planId}`, missionData);

// 미션 수정 API (status 제거)
export const updateMission = (missionId: string, missionData: MissionAdd) =>
  api.patch(`/missions/${missionId}`, missionData);

// 미션 삭제 API
export const deleteMission = (missionId: string) =>
  api.delete(`/missions/${missionId}`);

// 미션 상태 업데이트 API
export const updateMissionStatus = (missionId: string, newStatus: string) =>
  api.patch(`/missions/status/`, { id: missionId, status: newStatus });
