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
  Center,
} from '@chakra-ui/react';
import Layout from '@/components/Layout';

type MissionInput = {
  title: string;
  summation: string;
  day: string;
  message: string;
};

const AddMissionPage: React.FC = () => {
  const [missions, setMissions] = useState<MissionInput[]>([
    { title: '', summation: '', day: '', message: '' },
  ]);

  const handleInputChange = (
    index: number,
    field: keyof MissionInput,
    value: string
  ) => {
    const newMissions = [...missions];
    newMissions[index][field] = value;
    setMissions(newMissions);
  };

  const handleAddMission = () => {
    setMissions([
      ...missions,
      { title: '', summation: '', day: '', message: '' },
    ]);
  };

  const handleSaveMissions = async () => {
    try {
      for (const mission of missions) {
        // 여기에 API 호출을 추가하세요
        // await api.post('/missions', mission);
        console.log('Saving mission:', mission);
      }
      alert('미션이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error saving missions:', error);
      alert('미션 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <Center>
        <Box
          p={4}
          width='70vw'
          maxWidth='1200px'
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
                  <FormControl>
                    <FormLabel>Summation</FormLabel>
                    <Input
                      value={mission.summation}
                      onChange={(e) =>
                        handleInputChange(index, 'summation', e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl>
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
            <Button colorScheme='teal' onClick={handleAddMission}>
              추가
            </Button>
            <Button colorScheme='blue' onClick={handleSaveMissions}>
              저장
            </Button>
          </VStack>
        </Box>
      </Center>
    </Layout>
  );
};

export default AddMissionPage;
