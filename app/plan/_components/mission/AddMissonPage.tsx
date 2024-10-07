import React from 'react';
import MissionForm from './MissionForm';

import { Props } from '@/types/mission';

function AddMissionPage({ onClose, planId, onSave }: Props) {
  return (
    <MissionForm
      onClose={onClose}
      planId={planId}
      onSave={onSave}
      isEdit={false}
    />
  );
}

export default AddMissionPage;
