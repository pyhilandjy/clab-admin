export interface Mission {
  id: string;
  title: string;
  summation: string;
  day: string;
  message: string;
  status: string;
}

export interface MissionInput {
  title: string;
  summation: string;
  day: string;
  message: string;
}

export interface Props {
  onClose: () => void;
  planId?: string;
  mission?: MissionInput;
  onSave: () => Promise<void>;
  isEdit?: boolean;
}
