import React from 'react';

import { addReport } from '@/api/report';
import { Mission } from '@/types/mission';
import { ReportAdd } from '@/types/report';

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
  const handleSave = async (reportAddData: ReportAdd) => {
    try {
      await addReport(planId, reportAddData);
      await onSave();
      onClose();
    } catch (error) {
      console.error('리포트 추가 중 오류:', error);
    }
  };

  return (
    <ReportForm
      reportAddData={{
        report: {
          title: '',
          wordcloud: false,
          sentence_length: false,
          pos_ratio: false,
          speech_act: false,
          insight: false,
        },
        missions: [],
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default AddReportPage;
