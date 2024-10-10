import React from 'react';
import { Mission } from '@/types/mission';
import { addReport } from '@/api/report';
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
    quant_analysis: string[];
    qual_analysis: string[];
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
        quant_analysis: [],
        qual_analysis: [],
        missions_id: [],
      }}
      missions={missions}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default AddReportPage;
