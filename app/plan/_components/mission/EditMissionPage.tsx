'use client';
import React, { useState } from 'react';

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

type Mission = {
  id: string;
  title: string;
  summation: string;
  day: string;
  message: string;
  status: string;
};

const EditMissionPage: React.FC<{
  onClose: () => void;
  mission: Mission;
  onSave: () => Promise<void>;
}> = ({ onClose, mission, onSave }) => {
  const [missionData, setMissionData] = useState<Mission>(mission);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof Mission, value: string) => {
    setMissionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMission = async () => {
    setIsSubmitting(true);
    try {
      await api.patch(`/missions/`, missionData);
      await onSave();
      toast({
        title: '미션이 성공적으로 수정되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error updating mission:', error);
      toast({
        title: '미션 수정 중 오류가 발생했습니다.',
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
          <FormLabel>Title</FormLabel>
          <Input
            value={missionData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </FormControl>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Summation</FormLabel>
            <Input
              value={missionData.summation}
              onChange={(e) => handleInputChange('summation', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Day</FormLabel>
            <Input
              type='number'
              value={missionData.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
            />
          </FormControl>
        </HStack>
        <FormControl mt={2}>
          <FormLabel>Message</FormLabel>
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
          저장
        </Button>
      </VStack>
    </Box>
  );
};

export default EditMissionPage;
