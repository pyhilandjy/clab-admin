import React from 'react';

import { addReport } from '@/api/report';
import { Mission } from '@/types/mission';

import ReportForm from './ReportForm';

interface AddReportPageProps {
  planId: string;
  missions: Mission[];
  onClose: () => void;
  onSave: () => Promise<void>;
}

const AddReportPage: React.FC<AddReportPageProps> = ({
  planId,
  missions,
  onClose,
  onSave,
}) => {
  const handleSave = async (reportData: {
    title: string;
    wordcloud: boolean;
    sentence_length: boolean;
    pos_ratio: boolean;
    speech_act: boolean;
    insight: boolean;
    missions_id: string[];
  }) => {
    try {
      await addReport(planId, reportData);
      await onSave();
      onClose();
    } catch (error) {
      console.error('리포트 추가 중 오류:', error);
    }
  };

  return (
    <ReportForm
      reportData={{
        title: '',
        wordcloud: false,
        sentence_length: false,
        pos_ratio: false,
        speech_act: false,
        insight: false,
        missions_id: [],
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default AddReportPage;
