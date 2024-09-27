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

type MissionInput = {
  title: string;
  summation: string;
  day: string;
  message: string;
};

type Props = {
  onClose: () => void;
  planId: string;
  onSave: () => Promise<void>;
};

const AddMissionPage: React.FunctionComponent<Props> = ({
  onClose,
  planId,
  onSave,
}) => {
  const [missions, setMissions] = useState<MissionInput[]>([
    { title: '', summation: '', day: '', message: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (
    index: number,
    field: keyof MissionInput,
    value: string
  ) => {
    const newMissions = [...missions];
    newMissions[index][field] = value;
    setMissions(newMissions);
  };

  const handleSaveMissions = async () => {
    setIsSubmitting(true);
    try {
      for (const mission of missions) {
        const payload = {
          plan_id: planId,
          ...mission,
          day: parseInt(mission.day),
        };
        await api.post(`/missions/${planId}`, payload);
      }
      await onSave(); // 미션 저장 후 onSave 호출
      toast({
        title: '미션이 성공적으로 저장되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error saving missions:', error);
      toast({
        title: '미션 저장 중 오류가 발생했습니다.',
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
        {missions.map((mission, index) => (
          <Box key={index} p={4} borderWidth='1px' borderRadius='md'>
            <FormControl mb={2}>
              <FormLabel>Title</FormLabel>
              <Input
                value={mission.title}
                onChange={(e) =>
                  handleInputChange(index, 'title', e.target.value)
                }
              />
            </FormControl>
            <HStack spacing={4}>
              <FormControl flex={6}>
                <FormLabel>Summation</FormLabel>
                <Input
                  value={mission.summation}
                  onChange={(e) =>
                    handleInputChange(index, 'summation', e.target.value)
                  }
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel>Day</FormLabel>
                <Input
                  value={mission.day}
                  onChange={(e) =>
                    handleInputChange(index, 'day', e.target.value)
                  }
                />
              </FormControl>
            </HStack>
            <FormControl mt={2}>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={mission.message}
                onChange={(e) =>
                  handleInputChange(index, 'message', e.target.value)
                }
              />
            </FormControl>
          </Box>
        ))}
        <Button
          colorScheme='blue'
          onClick={handleSaveMissions}
          isLoading={isSubmitting}
        >
          저장
        </Button>
      </VStack>
    </Box>
  );
};

export default AddMissionPage;
