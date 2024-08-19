'use client';
import React, { useState, useEffect } from 'react';
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
  Select,
} from '@chakra-ui/react';
import api from '@/lib/api';
import Layout from '../../../components/Layout';

type Category = {
  id: string;
  name: string;
  parent_id?: string;
};

const AddPlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [startAgeMonth, setStartAgeMonth] = useState('');
  const [endAgeMonth, setEndAgeMonth] = useState('');
  const [day, setDay] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await api.get('/category/main/');
        setMainCategories(response.data);
      } catch (error) {
        console.error('Error fetching main categories:', error);
      }
    };
    fetchMainCategories();
  }, []);

  // 서브 카테고리 가져오기 (메인 카테고리 선택 시)
  useEffect(() => {
    if (selectedMainCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await api.get(
            `/category/sub/?parents_id=${selectedMainCategory}`
          );
          setSubCategories(response.data);
        } catch (error) {
          console.error('Error fetching sub categories:', error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedMainCategory]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const payload = {
      plan_name: planName,
      price: parseInt(price),
      start_age_month: parseInt(startAgeMonth),
      end_age_month: parseInt(endAgeMonth),
      day: parseInt(day),
      description,
      type,
      tags: tagsArray,
      category_id: selectedSubCategory,
    };

    try {
      await api.post('/plans/', payload);
      alert('플랜이 저장되었습니다.');
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='day' isRequired>
                    <FormLabel>일수</FormLabel>
                    <Input
                      type='number'
                      value={day}
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
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={1}>
                  <FormControl id='type'>
                    <FormLabel>타입</FormLabel>
                    <Select
                      placeholder='타입을 선택하세요'
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value='달성형'>달성형</option>
                      <option value='기간형'>기간형</option>
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='tags'>
                    <FormLabel>태그 (콤마로 구분)</FormLabel>
                    <Input
                      type='text'
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </FormControl>
                </GridItem>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <GridItem colSpan={1}>
                  <FormControl id='main_category'>
                    <FormLabel>메인 카테고리</FormLabel>
                    <Select
                      placeholder='메인 카테고리를 선택하세요'
                      value={selectedMainCategory}
                      onChange={(e) => setSelectedMainCategory(e.target.value)}
                    >
                      {mainCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl id='sub_category' isRequired>
                    <FormLabel>서브 카테고리</FormLabel>
                    <Select
                      placeholder='서브 카테고리를 선택하세요'
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      isDisabled={!selectedMainCategory}
                    >
                      {subCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
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
