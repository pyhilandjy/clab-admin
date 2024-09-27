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
  Select,
} from '@chakra-ui/react';
import api from '@/lib/api';
import Layout from '../../../../components/Layout';

type Category = {
  id: string;
  name: string;
  parent_id?: string;
  sub_categories?: Category[];
};

const EditPlanPage = () => {
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [startAgeMonth, setStartAgeMonth] = useState<string>('');
  const [endAgeMonth, setEndAgeMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const router = useRouter();
  const { plan_id } = useParams();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await api.get(`/plans/${plan_id}`);
        const plan = response.data;

        setPlanName(plan.plan_name || '');
        setPrice(plan.price != null ? plan.price.toString() : '');
        setStartAgeMonth(
          plan.start_age_month != null ? plan.start_age_month.toString() : ''
        );
        setEndAgeMonth(
          plan.end_age_month != null ? plan.end_age_month.toString() : ''
        );
        setDay(plan.day != null ? plan.day.toString() : '');
        setDescription(plan.description || '');
        setType(plan.type || '');
        setTags(plan.tags ? plan.tags.join(', ') : '');

        const categoriesResponse = await api.get('/categories/');
        const categories: Category[] = categoriesResponse.data;

        let foundMainCategory: Category | undefined;
        let foundSubCategory: Category | undefined;

        // 서브카테고리로부터 메인카테고리 찾기
        for (const mainCategory of categories) {
          const subCategory = mainCategory.sub_categories?.find(
            (sub) => sub.id === plan.category_id
          );
          if (subCategory) {
            foundMainCategory = mainCategory;
            foundSubCategory = subCategory;
            break;
          }
        }

        if (foundMainCategory && foundSubCategory) {
          setSelectedMainCategory(foundMainCategory.id);
          setSubCategories(foundMainCategory.sub_categories || []);
          setSelectedSubCategory(foundSubCategory.id);
        }

        setMainCategories(categories);
      } catch (error) {
        console.error('Error fetching plan data:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPlanData();
  }, [plan_id]);

  const handleMainCategoryChange = (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
    const mainCategory = mainCategories.find(
      (category) => category.id === mainCategoryId
    );
    setSubCategories(mainCategory?.sub_categories || []);
    setSelectedSubCategory(''); // 서브 카테고리 선택 초기화
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const payload = {
      id: plan_id,
      plan_name: planName,
      price: price !== null ? parseInt(price) : null,
      start_age_month: startAgeMonth !== null ? parseInt(startAgeMonth) : null,
      end_age_month: endAgeMonth !== null ? parseInt(endAgeMonth) : null,
      day: day !== null ? parseInt(day) : null,
      description,
      type,
      tags: tagsArray,
      category_id: selectedSubCategory,
    };

    try {
      await api.put(`/plans/${plan_id}`, payload);
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
                      onChange={(e) => handleMainCategoryChange(e.target.value)}
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
