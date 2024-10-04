import React from 'react';

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
  Select,
} from '@chakra-ui/react';

import { Category } from '@/types/plan';

type PlanFormProps = {
  planName: string;
  price: string;
  startAgeMonth: string;
  endAgeMonth: string;
  day: string;
  description: string;
  type: string;
  tags: string;
  mainCategories: Category[];
  subCategories: Category[];
  selectedMainCategory: string;
  selectedSubCategory: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleMainCategoryChange: (mainCategoryId: string) => void;
  onSubCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  isEdit?: boolean;
};

const PlanForm: React.FC<PlanFormProps> = ({
  planName,
  price,
  startAgeMonth,
  endAgeMonth,
  day,
  description,
  type,
  tags,
  mainCategories,
  subCategories,
  selectedMainCategory,
  selectedSubCategory,
  onChange,
  onSubmit,
  handleMainCategoryChange,
  onSubCategoryChange,
  isEdit = false,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Box
        border='1px'
        borderColor='gray.200'
        borderRadius='md'
        p={5}
        mb={10}
        width='100%'
      >
        <Heading as='h2' size='md' mb={4}>
          {isEdit ? '플랜 수정' : '플랜 추가'}
        </Heading>
        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={2}>
            <FormControl id='plan_name' isRequired>
              <FormLabel>플랜 이름</FormLabel>
              <Input
                type='text'
                value={planName}
                name='planName'
                onChange={onChange}
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
                name='price'
                onChange={onChange}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='day' isRequired>
              <FormLabel>일수</FormLabel>
              <Input type='number' value={day} name='day' onChange={onChange} />
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
                name='startAgeMonth'
                onChange={onChange}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='end_age_month'>
              <FormLabel>종료 나이 (개월)</FormLabel>
              <Input
                type='number'
                value={endAgeMonth}
                name='endAgeMonth'
                onChange={onChange}
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
                name='type'
                onChange={onChange}
              >
                <option value='달성형'>달성형</option>
                <option value='기간형'>기간형</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='tags'>
              <FormLabel>태그 (콤마로 구분)</FormLabel>
              <Input type='text' value={tags} name='tags' onChange={onChange} />
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
                name='selectedSubCategory'
                onChange={onSubCategoryChange} // 수정된 부분
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
        <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} mb={4}>
          <Heading as='h2' size='md' mb={4}>
            플랜 설명
          </Heading>
          <FormControl id='description' mb={4}>
            <Textarea
              height='200px'
              value={description}
              name='description'
              onChange={onChange}
              width='100%'
            />
          </FormControl>
        </Box>
      </Box>
      <Button type='submit' colorScheme='blue' mt={4}>
        {isEdit ? '수정' : '생성'}
      </Button>
    </form>
  );
};

export default PlanForm;
