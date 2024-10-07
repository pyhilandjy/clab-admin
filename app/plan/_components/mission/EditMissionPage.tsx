import React from 'react';
import MissionForm from './MissionForm';

import { Props } from '@/types/mission';

const EditMissionPage: React.FC<Props> = ({ onClose, mission, onSave }) => {
  return (
    <MissionForm
      onClose={onClose}
      mission={mission}
      onSave={onSave}
      isEdit={true}
    />
  );
};

export default EditMissionPage;
