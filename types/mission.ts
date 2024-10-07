// mission.ts
export interface Mission {
  id: string;
  title: string;
  summation: string;
  day: string;
  message: string;
  status: string;
}

export interface MissionAdd {
  title: string;
  summation: string;
  day: string;
  message: string;
}

export interface Props {
  onClose: () => void;
  planId?: string;
  mission?: Mission;
  onSave: () => Promise<void>;
  isEdit?: boolean;
}

export interface MissionListProps {
  missions: Mission[];
  isOpen: boolean;
  onDeleteSuccess: (missionId: string) => void;
  planId: string;
  onAddMission: () => Promise<void>;
}
