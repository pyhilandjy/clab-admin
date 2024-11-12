import React from 'react';

import { Props } from '@/types/mission';

import MissionForm from './MissionForm';

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
