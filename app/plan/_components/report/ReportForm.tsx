import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Mission } from '@/types/mission';

interface ReportData {
  title: string;
  quant_analysis: string[];
  qual_analysis: string[];
  missions_id: string[];
}

interface ReportFormProps {
  reportData: ReportData;
  missions: Mission[];
  onSave: (updatedReportData: ReportData) => Promise<void>;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  reportData: initialReportData,
  missions,
  onSave,
  onClose,
}) => {
  const [reportData, setReportData] = useState<ReportData>(initialReportData);

  useEffect(() => {
    setReportData(initialReportData);
  }, [initialReportData]);

  const handleCheckboxChange = (
    field: 'quant_analysis' | 'qual_analysis',
    value: string,
  ) => {
    setReportData((prev) => {
      const newValues = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleMissionSelect = (missionId: string) => {
    setReportData((prev) => {
      const newMissions = prev.missions_id.includes(missionId)
        ? prev.missions_id.filter((id) => id !== missionId)
        : [...prev.missions_id, missionId];
      return { ...prev, missions_id: newMissions };
    });
  };

  const handleSubmit = async () => {
    await onSave(reportData);
    onClose();
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align='stretch'>
        <FormControl isRequired mb={2}>
          <FormLabel>리포트명</FormLabel>
          <Input
            value={reportData.title}
            onChange={(e) =>
              setReportData({ ...reportData, title: e.target.value })
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>양적 분석</FormLabel>
          <HStack spacing={4}>
            <Checkbox
              isChecked={reportData.quant_analysis.includes('워드클라우드')}
              onChange={() =>
                handleCheckboxChange('quant_analysis', '워드클라우드')
              }
            >
              워드클라우드
            </Checkbox>
            <Checkbox
              isChecked={reportData.quant_analysis.includes('문장길이')}
              onChange={() =>
                handleCheckboxChange('quant_analysis', '문장길이')
              }
            >
              문장길이
            </Checkbox>
            <Checkbox
              isChecked={reportData.quant_analysis.includes('품사비율')}
              onChange={() =>
                handleCheckboxChange('quant_analysis', '품사비율')
              }
            >
              품사비율
            </Checkbox>
            <Checkbox
              isChecked={reportData.quant_analysis.includes('대화내용')}
              onChange={() =>
                handleCheckboxChange('quant_analysis', '대화내용')
              }
            >
              대화내용
            </Checkbox>
            <Checkbox
              isChecked={reportData.quant_analysis.includes('문장분류')}
              onChange={() =>
                handleCheckboxChange('quant_analysis', '문장분류')
              }
            >
              문장분류
            </Checkbox>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>질적 분석</FormLabel>
          <Checkbox
            isChecked={reportData.qual_analysis.includes('인사이트')}
            onChange={() => handleCheckboxChange('qual_analysis', '인사이트')}
          >
            인사이트
          </Checkbox>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>연결할 미션 선택</FormLabel>
          <VStack align='start'>
            {missions.map((mission) => (
              <Checkbox
                key={mission.id}
                isChecked={reportData.missions_id.includes(mission.id)}
                onChange={() => handleMissionSelect(mission.id)}
              >
                {mission.title} (Day {mission.day})
              </Checkbox>
            ))}
          </VStack>
        </FormControl>

        <Button colorScheme='blue' onClick={handleSubmit}>
          저장
        </Button>
      </VStack>
    </Box>
  );
};

export default ReportForm;
