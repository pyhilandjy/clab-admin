import React from 'react';

import { Props } from '@/types/mission';

import MissionForm from './MissionForm';

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
