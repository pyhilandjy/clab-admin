'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  GridItem,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import Layout from '../../../components/Layout';

const AddPlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [startAgeMonth, setStartAgeMonth] = useState('');
  const [endAgeMonth, setEndAgeMonth] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const backendUrl = 'http://localhost:2456';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      plan_name: planName,
      price: parseInt(price),
      start_age_month: parseInt(startAgeMonth),
      end_age_month: parseInt(endAgeMonth),
      description,
    };

    try {
      await axios.post(`${backendUrl}/plans/`, payload);
      router.push('/plan');
    } catch (error) {
      console.error('Error adding plan:', error);
      alert('플랜 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <Center>
        <Box p={4} width='70vw' maxWidth='1200px'>
          <Heading as='h1' mb={4}>
            플랜 추가
          </Heading>
          <form onSubmit={handleSubmit}>
            <Box
              border='1px'
              borderColor='gray.200'
              borderRadius='md'
              p={5}
              mb={10}
              width='100%'
            >
              <Heading as='h2' size='md' mb={4}>
                패키지 기본 정보
              </Heading>
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={1}>
                  <FormControl id='plan_name' isRequired>
                    <FormLabel>패키지 이름</FormLabel>
                    <Input
                      type='text'
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='price'>
                    <FormLabel>가격</FormLabel>
                    <Input
                      type='number'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='start_age_month'>
                    <FormLabel>시작 나이 (개월)</FormLabel>
                    <Input
                      type='number'
                      value={startAgeMonth}
                      onChange={(e) => setStartAgeMonth(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='end_age_month'>
                    <FormLabel>종료 나이 (개월)</FormLabel>
                    <Input
                      type='number'
                      value={endAgeMonth}
                      onChange={(e) => setEndAgeMonth(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </SimpleGrid>
            </Box>
            <Box
              border='1px'
              borderColor='gray.200'
              borderRadius='md'
              p={4}
              mb={4}
              width='100%'
            >
              <Heading as='h2' size='md' mb={4}>
                패키지 설명
              </Heading>
              <FormControl id='description' mb={4}>
                <Textarea
                  height='200px'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  width='100%'
                />
              </FormControl>
            </Box>
            <Button type='submit' colorScheme='blue' mt={4}>
              생성
            </Button>
          </form>
        </Box>
      </Center>
    </Layout>
  );
};

export default AddPlanPage;
