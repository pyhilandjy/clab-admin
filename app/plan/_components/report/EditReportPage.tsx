import React from 'react';

import { updateReport } from '@/api/report';
import { Mission } from '@/types/mission';
import { ReportWithMissions, ReportAdd } from '@/types/report';

import ReportForm from './ReportForm';

interface EditReportPageProps {
  reportWithMissions: ReportWithMissions;
  missions: Mission[];
  onClose: () => void;
  onSave: () => Promise<void>;
}

const EditReportPage: React.FC<EditReportPageProps> = ({
  reportWithMissions,
  missions,
  onClose,
  onSave,
}) => {
  const handleSave = async (updatedReportData: ReportAdd) => {
    try {
      await updateReport(reportWithMissions.report.id, {
        ...updatedReportData,
        id: reportWithMissions.report.id,
      });
      await onSave();
      onClose();
    } catch (error) {
      console.error('리포트 수정 중 오류:', error);
    }
  };

  console.log('모달오픈');
  console.log(missions);

  return (
    <ReportForm
      reportAddData={{
        report: {
          title: reportWithMissions.report.title,
          wordcloud: reportWithMissions.report.wordcloud,
          sentence_length: reportWithMissions.report.sentence_length,
          pos_ratio: reportWithMissions.report.pos_ratio,
          speech_act: reportWithMissions.report.speech_act,
          insight: reportWithMissions.report.insight,
        },
        missions: reportWithMissions.missions.map((mission) => ({
          id: mission.id,
        })),
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default EditReportPage;
