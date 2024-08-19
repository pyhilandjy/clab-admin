'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import api from '@/lib/api';
import Layout from '../../../../components/Layout';

const EditPlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState<string | null>(null);
  const [startAgeMonth, setStartAgeMonth] = useState<string | null>(null);
  const [endAgeMonth, setEndAgeMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const router = useRouter();
  const { plan_id } = useParams();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await api.get(`/plans/${plan_id}`);
        const plan = response.data[0];
        const {
          plan_name,
          price,
          start_age_month,
          end_age_month,
          day,
          description,
        } = plan;

        setPlanName(plan_name);
        setPrice(price !== null ? price.toString() : '');
        setStartAgeMonth(
          start_age_month !== null ? start_age_month.toString() : ''
        );
        setEndAgeMonth(end_age_month !== null ? end_age_month.toString() : '');
        setDay(day !== null ? day.toString() : '');
        setDescription(description !== null ? description : '');
      } catch (error) {
        console.error('Error fetching plan data:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPlanData();
  }, [plan_id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      id: plan_id,
      plan_name: planName,
      price: price !== null ? parseInt(price) : null,
      start_age_month: startAgeMonth !== null ? parseInt(startAgeMonth) : null,
      end_age_month: endAgeMonth !== null ? parseInt(endAgeMonth) : null,
      day: day !== null ? parseInt(day) : null,
      description,
    };

    try {
      await api.put('/plans/', payload);
      alert('플랜 수정이 성공적으로 완료되었습니다.');
      setTimeout(() => {
        router.push('/plan');
      }, 200);
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('플랜 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <Center>
        <Box p={4} width='70vw' maxWidth='1200px'>
          <Heading as='h1' mb={4}>
            플랜 수정
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
                플랜 기본 정보
              </Heading>
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={2}>
                  <FormControl id='plan_name' isRequired>
                    <FormLabel>플랜 이름</FormLabel>
                    <Input
                      type='text'
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={1}>
                  <FormControl id='price'>
                    <FormLabel>가격</FormLabel>
                    <Input
                      type='number'
                      value={price !== null ? price : ''}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='day'>
                    <FormLabel>일수</FormLabel>
                    <Input
                      type='number'
                      value={day !== null ? day : ''}
                      onChange={(e) => setDay(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={1}>
                  <FormControl id='start_age_month'>
                    <FormLabel>시작 나이 (개월)</FormLabel>
                    <Input
                      type='number'
                      value={startAgeMonth !== null ? startAgeMonth : ''}
                      onChange={(e) => setStartAgeMonth(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='end_age_month'>
                    <FormLabel>종료 나이 (개월)</FormLabel>
                    <Input
                      type='number'
                      value={endAgeMonth !== null ? endAgeMonth : ''}
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
                플랜 설명
              </Heading>
              <FormControl id='description' mb={4}>
                <Textarea
                  height='200px'
                  value={description !== null ? description : ''}
                  onChange={(e) => setDescription(e.target.value)}
                  width='100%'
                />
              </FormControl>
            </Box>
            <Button type='submit' colorScheme='blue' mt={4}>
              저장
            </Button>
          </form>
        </Box>
      </Center>
    </Layout>
  );
};

export default EditPlanPage;
