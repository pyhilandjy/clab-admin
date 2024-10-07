'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';

import api from '@/lib/api';

interface MissionInput {
  title: string;
  summation: string;
  day: string;
  message: string;
}

interface Props {
  onClose: () => void;
  planId?: string;
  mission?: MissionInput;
  onSave: () => Promise<void>;
  isEdit?: boolean;
}

const MissionForm: React.FC<Props> = ({
  onClose,
  planId,
  mission,
  onSave,
  isEdit = false,
}) => {
  const [missionData, setMissionData] = useState<MissionInput>(
    mission || { title: '', summation: '', day: '', message: '' },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof MissionInput, value: string) => {
    setMissionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMission = async () => {
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await api.patch(`/missions/`, missionData);
      } else {
        const payload = {
          plan_id: planId,
          ...missionData,
          day: parseInt(missionData.day),
        };
        await api.post(`/missions/${planId}`, payload);
      }

      await onSave();
      toast({
        title: `미션이 성공적으로 ${isEdit ? '수정' : '저장'}되었습니다.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'saving'} mission:`, error);
      toast({
        title: `미션 ${isEdit ? '수정' : '저장'} 중 오류가 발생했습니다.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      p={4}
      width='100%'
      border='1px'
      borderColor='gray.200'
      borderRadius='md'
      mb={4}
    >
      <VStack spacing={4} align='stretch'>
        <FormControl mb={2}>
          <FormLabel>미션명</FormLabel>
          <Input
            value={missionData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </FormControl>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>요약</FormLabel>
            <Input
              value={missionData.summation}
              onChange={(e) => handleInputChange('summation', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>일수</FormLabel>
            <Input
              type='number'
              value={missionData.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
            />
          </FormControl>
        </HStack>
        <FormControl mt={2}>
          <FormLabel>미션 메세지</FormLabel>
          <Textarea
            value={missionData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme='blue'
          onClick={handleSaveMission}
          isLoading={isSubmitting}
        >
          {isEdit ? '수정' : '저장'}
        </Button>
      </VStack>
    </Box>
  );
};

export default MissionForm;
