import React, { useState } from 'react';

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
import { ReportAdd } from '@/types/report';

interface ReportFormProps {
  reportAddData: ReportAdd;
  missions: Mission[];
  onSave: (reportAddData: ReportAdd) => Promise<void>;
  onClose: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  reportAddData: initialReportAddData,
  missions,
  onSave,
  onClose,
}) => {
  const [reportAddData, setReportAddData] =
    useState<ReportAdd>(initialReportAddData);

  const handleCheckboxChange = (field: keyof ReportAdd['report']) => {
    setReportAddData((prev) => ({
      ...prev,
      report: { ...prev.report, [field]: !prev.report[field] },
    }));
  };

  const handleMissionSelect = (missionId: string) => {
    setReportAddData((prev) => {
      const isCurrentlyChecked = prev.missions.some(
        (mission) => mission.id === missionId,
      );

      const updatedMissions = isCurrentlyChecked
        ? prev.missions.filter((mission) => mission.id !== missionId)
        : [...prev.missions, { id: missionId }];

      return { ...prev, missions: updatedMissions };
    });
  };

  const handleSubmit = async () => {
    await onSave(reportAddData);
    onClose();
  };

  return (
    <Box p={4}>
      <VStack spacing={4} align='stretch'>
        <FormControl isRequired mb={2}>
          <FormLabel>리포트명</FormLabel>
          <Input
            value={reportAddData.report.title}
            onChange={(e) =>
              setReportAddData((prev) => ({
                ...prev,
                report: { ...prev.report, title: e.target.value },
              }))
            }
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>양적 분석</FormLabel>
          <HStack spacing={4}>
            <Checkbox
              isChecked={reportAddData.report.wordcloud}
              onChange={() => handleCheckboxChange('wordcloud')}
            >
              워드클라우드
            </Checkbox>
            <Checkbox
              isChecked={reportAddData.report.sentence_length}
              onChange={() => handleCheckboxChange('sentence_length')}
            >
              문장길이
            </Checkbox>
            <Checkbox
              isChecked={reportAddData.report.pos_ratio}
              onChange={() => handleCheckboxChange('pos_ratio')}
            >
              품사비율
            </Checkbox>
            <Checkbox
              isChecked={reportAddData.report.speech_act}
              onChange={() => handleCheckboxChange('speech_act')}
            >
              문장분류
            </Checkbox>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>질적 분석</FormLabel>
          <Checkbox
            isChecked={reportAddData.report.insight}
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
                isChecked={reportAddData.missions.some(
                  (selectedMission) => selectedMission.id === mission.id,
                )}
                onChange={() => handleMissionSelect(mission.id)}
              >
                {mission.title}
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
