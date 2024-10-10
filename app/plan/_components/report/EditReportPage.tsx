import React from 'react';
import { Mission } from '@/types/mission';
import { Report } from '@/types/report';
import { updateReport } from '@/api/report';
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
    quant_analysis: string[];
    qual_analysis: string[];
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
        quant_analysis: report.quant_analysis,
        qual_analysis: report.qual_analysis,
        missions_id: report.missions_id,
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default EditReportPage;
