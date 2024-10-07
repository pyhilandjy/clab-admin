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
        width='70%'
        position='absolute'
        top='3%'
        left='16%'
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={4}
        >
          <Heading as='h2' size='md'>
            {isEdit ? '플랜 수정' : '플랜 추가'}
          </Heading>
          <Button type='submit' colorScheme='blue' width='150px'>
            {isEdit ? '수정' : '생성'}
          </Button>
        </Box>

        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={2}>
            <FormControl id='plan_name' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='128px' mb={0}>
                  플랜 이름
                </FormLabel>
                <Input
                  type='text'
                  value={planName}
                  name='planName'
                  onChange={onChange}
                />
              </Box>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='price'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='157px' mb={0}>
                  가격
                </FormLabel>
                <Input
                  type='number'
                  value={price}
                  name='price'
                  onChange={onChange}
                />
              </Box>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='day' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  미션 갯수
                </FormLabel>
                <Input
                  type='number'
                  value={day}
                  name='day'
                  onChange={onChange}
                />
              </Box>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='type'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  타입
                </FormLabel>
                <Select
                  placeholder='타입을 선택하세요'
                  value={type}
                  name='type'
                  onChange={onChange}
                >
                  <option value='달성형'>달성형</option>
                  <option value='기간형'>기간형</option>
                </Select>
              </Box>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='tags'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  메타데이터
                </FormLabel>
                <Input
                  type='text'
                  value={tags}
                  name='tags'
                  onChange={onChange}
                  placeholder='컴마로 구분해 주세요'
                />
              </Box>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='main_category'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  메인 카테고리
                </FormLabel>
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
              </Box>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='sub_category' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  서브 카테고리
                </FormLabel>
                <Select
                  placeholder='서브 카테고리를 선택하세요'
                  value={selectedSubCategory}
                  name='selectedSubCategory'
                  onChange={onSubCategoryChange}
                  isDisabled={!selectedMainCategory}
                >
                  {subCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='recommended_age'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='140px' mb={0}>
                  추천 월령
                </FormLabel>
                <Box display='flex' gap={4}>
                  <Input
                    type='number'
                    value={startAgeMonth}
                    name='startAgeMonth'
                    onChange={onChange}
                    placeholder='시작 나이'
                  />
                  <Input
                    type='number'
                    value={endAgeMonth}
                    name='endAgeMonth'
                    onChange={onChange}
                    placeholder='종료 나이'
                  />
                </Box>
              </Box>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='day' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='150px' mb={0}>
                  레이블
                </FormLabel>
                <Select placeholder='준비중' isDisabled></Select>
              </Box>
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
    </form>
  );
};

export default PlanForm;
