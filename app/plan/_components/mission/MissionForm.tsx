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
  useToast,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react';

import { addMission, updateMission } from '@/api/mission';
import { MissionAdd, Props } from '@/types/mission';

const MissionForm: React.FC<Props> = ({
  onClose,
  planId,
  mission,
  onSave,
  isEdit = false,
}) => {
  const [missionData, setMissionData] = useState<MissionAdd>(
    mission || { title: '', summary: '', day: '', message: '' },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof MissionAdd, value: string) => {
    setMissionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMission = async () => {
    setIsSubmitting(true);
    try {
      if (isEdit && mission && 'id' in mission) {
        await updateMission(mission.id, missionData);
      } else {
        await addMission(planId!, missionData);
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
      p={5}
      width='80%'
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
      mb={6}
      boxShadow='sm'
      mx='auto' // 중앙 배치
    >
      <VStack spacing={6} align='stretch'>
        {/* 미션명과 발행순서 */}
        <SimpleGrid columns={4} spacing={6}>
          <GridItem colSpan={3}>
            <FormControl isRequired>
              <FormLabel>미션명</FormLabel>
              <Input
                value={missionData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl isRequired>
              <FormLabel>발행순서</FormLabel>
              <Input
                placeholder='숫자만 입력하세요'
                type='number'
                value={missionData.day}
                onChange={(e) => handleInputChange('day', e.target.value)}
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>

        {/* 요약 */}
        <SimpleGrid columns={2} spacing={6}>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>요약</FormLabel>
              <Textarea
                value={missionData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>

        {/* 미션 메세지 */}
        <SimpleGrid columns={2} spacing={6}>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>미션 메세지</FormLabel>
              <Textarea
                value={missionData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>

        {/* 저장 버튼 */}
        <Button
          colorScheme='blue'
          onClick={handleSaveMission}
          isLoading={isSubmitting}
          alignSelf='flex-end' // 버튼을 오른쪽에 배치
        >
          {isEdit ? '수정' : '저장'}
        </Button>
      </VStack>
    </Box>
  );
};

export default MissionForm;
