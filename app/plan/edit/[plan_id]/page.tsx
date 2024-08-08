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
import axios from 'axios';
import Layout from '../../../../components/Layout';

const EditPlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState<string | null>(null);
  const [startAgeMonth, setStartAgeMonth] = useState<string | null>(null);
  const [endAgeMonth, setEndAgeMonth] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const router = useRouter();
  const { plan_id } = useParams();
  const backendUrl = 'http://localhost:2456';

  useEffect(() => {
    // 기존 데이터 로드
    axios
      .get(`${backendUrl}/plans/${plan_id}`)
      .then((response) => {
        const plan = response.data[0]; // 배열의 첫 번째 요소 가져오기
        const {
          plan_name,
          price,
          start_age_month,
          end_age_month,
          description,
        } = plan;
        setPlanName(plan_name);
        setPrice(price !== null ? price.toString() : '');
        setStartAgeMonth(
          start_age_month !== null ? start_age_month.toString() : ''
        );
        setEndAgeMonth(end_age_month !== null ? end_age_month.toString() : '');
        setDescription(description !== null ? description : '');
      })
      .catch((error) => {
        console.error('Error fetching plan data:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      });
  }, [backendUrl, plan_id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      id: plan_id,
      plan_name: planName,
      price: price !== null ? parseInt(price) : null,
      start_age_month: startAgeMonth !== null ? parseInt(startAgeMonth) : null,
      end_age_month: endAgeMonth !== null ? parseInt(endAgeMonth) : null,
      description,
    };

    try {
      await axios.put(`${backendUrl}/plans/`, payload);
      alert('플랜 수정이 성공적으로 완료되었습니다.');
      setTimeout(() => {
        router.push('/plan');
      }, 0);
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
                      value={price !== null ? price : ''}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
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
                패키지 설명
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
