import React from 'react';

import { updateReport } from '@/api/report';
import { Mission } from '@/types/mission';
import { Report } from '@/types/report';

import ReportForm from './ReportForm';

interface EditReportPageProps {
  report: Report;
  missions: Mission[];
  onClose: () => void;
  onSave: () => Promise<void>;
}

const EditReportPage: React.FC<EditReportPageProps> = ({
  report,
  missions,
  onClose,
  onSave,
}) => {
  const handleSave = async (updatedReportData: {
    title: string;
    wordcloud: boolean;
    sentence_length: boolean;
    pos_ratio: boolean;
    speech_act: boolean;
    insight: boolean;
    missions_id: string[];
  }) => {
    try {
      await updateReport(report.id, updatedReportData);
      await onSave();
      onClose();
    } catch (error) {
      console.error('리포트 수정 중 오류:', error);
    }
  };

  return (
    <ReportForm
      reportData={{
        title: report.title,
        wordcloud: report.wordcloud,
        sentence_length: report.sentence_length,
        pos_ratio: report.pos_ratio,
        speech_act: report.speech_act,
        insight: report.insight,
        missions_id: report.missions_id,
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default EditReportPage;
