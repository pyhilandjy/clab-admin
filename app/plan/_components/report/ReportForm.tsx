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
  wordcloud: boolean;
  sentence_length: boolean;
  pos_ratio: boolean;
  speech_act: boolean;
  insight: boolean;
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
  const [reportData, setReportData] = useState<ReportData>({
    title: initialReportData.title || '',
    wordcloud: initialReportData.wordcloud || false,
    sentence_length: initialReportData.sentence_length || false,
    pos_ratio: initialReportData.pos_ratio || false,
    speech_act: initialReportData.speech_act || false,
    insight: initialReportData.insight || false,
    missions_id: initialReportData.missions_id || [],
  });

  useEffect(() => {
    setReportData(initialReportData);
  }, [initialReportData]);

  const handleCheckboxChange = (field: keyof ReportData) => {
    setReportData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
              isChecked={reportData.wordcloud}
              onChange={() => handleCheckboxChange('wordcloud')}
            >
              워드클라우드
            </Checkbox>
            <Checkbox
              isChecked={reportData.sentence_length}
              onChange={() => handleCheckboxChange('sentence_length')}
            >
              문장길이
            </Checkbox>
            <Checkbox
              isChecked={reportData.pos_ratio}
              onChange={() => handleCheckboxChange('pos_ratio')}
            >
              품사비율
            </Checkbox>
            <Checkbox
              isChecked={reportData.speech_act}
              onChange={() => handleCheckboxChange('speech_act')}
            >
              문장분류
            </Checkbox>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>질적 분석</FormLabel>
          <Checkbox
            isChecked={reportData.insight}
            onChange={() => handleCheckboxChange('insight')}
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
