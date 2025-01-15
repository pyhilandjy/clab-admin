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
  Text,
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
  summary: string;
  descriptionImageName: string | null;
  descriptionImageUrl: string | null;
  thumbnailImageName: string | null;
  thumbnailImageUrl: string | null;
  schedule: string;
  scheduleImageName: string | null;
  scheduleImageUrl: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  handleMainCategoryChange: (mainCategoryId: string) => void;
  onSubCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescriptionFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onThumbnailFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScheduleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  summary,
  descriptionImageName,
  descriptionImageUrl,
  thumbnailImageName,
  thumbnailImageUrl,
  schedule,
  scheduleImageName,
  scheduleImageUrl,
  onChange,
  onSubmit,
  handleMainCategoryChange,
  onSubCategoryChange,
  onDescriptionFileChange,
  onThumbnailFileChange,
  onScheduleFileChange,
  isEdit = false,
}) => {
  const openPopup = (url: string) => {
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <Box
        border='1px'
        borderColor='gray.200'
        borderRadius='md'
        p={5}
        mb={10}
        width='70%'
        position='relative'
        top='30px'
        left='3%'
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

        <SimpleGrid columns={2} spacing={150} mb={4}>
          <GridItem colSpan={2}>
            <FormControl id='plan_name' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='147px' mb={0}>
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

        <SimpleGrid columns={2} spacing={150} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='price' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='248px' mb={0}>
                  가격
                </FormLabel>
                <Input
                  type='number'
                  value={price}
                  name='price'
                  onChange={onChange}
                />
                <Box ml={2}>원</Box>
              </Box>
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <FormControl id='day' isRequired>
              <Box display='flex' alignItems='center'>
                <FormLabel width='140px' mb={0}>
                  미션 갯수
                </FormLabel>
                <Input
                  type='number'
                  value={day}
                  name='day'
                  onChange={onChange}
                  width={300}
                />
                <Box ml={2}>개</Box>
              </Box>
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={150} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='type'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='200px' mb={0}>
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

        <SimpleGrid columns={2} spacing={150} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='main_category'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='200px' mb={0}>
                  카테고리
                </FormLabel>
                <Select
                  placeholder='카테고리를 선택하세요'
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
            <FormControl id='sub_category'>
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

        <SimpleGrid columns={2} spacing={150} mb={4}>
          <GridItem colSpan={1}>
            <FormControl id='recommended_age'>
              <Box display='flex' alignItems='center'>
                <FormLabel width='250px' mb={0}>
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
            썸네일
          </Heading>
          <FormControl id='thumbnail' mb={4}>
            <FormLabel>이미지 업로드</FormLabel>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              {thumbnailImageName && thumbnailImageUrl ? (
                <>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    onClick={() => openPopup(thumbnailImageUrl)}
                  >
                    {thumbnailImageName}
                  </Text>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onThumbnailFileChange}
                    display='none'
                    id='thumbnail-image-upload'
                  />
                  <label htmlFor='thumbnail-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              ) : (
                <>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onThumbnailFileChange}
                    display='none'
                    id='thumbnail-image-upload'
                  />
                  <label htmlFor='thumbnail-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              )}
            </Box>
          </FormControl>
        </Box>

        <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} mb={4}>
          <Heading as='h2' size='md' mb={4}>
            플랜 설명
          </Heading>
          <FormControl id='description' mb={4}>
            <FormLabel>설명</FormLabel>
            <Textarea
              height='200px'
              value={description}
              name='description'
              onChange={onChange}
              width='100%'
            />
          </FormControl>
          <FormControl id='summary' mb={4}>
            <FormLabel>요약</FormLabel>
            <Textarea
              height='100px'
              value={summary}
              name='summary'
              onChange={onChange}
              width='100%'
            />
          </FormControl>
          <FormControl mb='20px'>
            <FormLabel>설명 이미지 업로드</FormLabel>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              {descriptionImageName && descriptionImageUrl ? (
                <>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    onClick={() => openPopup(descriptionImageUrl)}
                  >
                    {descriptionImageName}
                  </Text>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onDescriptionFileChange}
                    display='none'
                    id='description-image-upload'
                  />
                  <label htmlFor='description-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              ) : (
                <>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onDescriptionFileChange}
                    display='none'
                    id='description-image-upload'
                  />
                  <label htmlFor='description-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              )}
            </Box>
          </FormControl>
        </Box>

        <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} mb={4}>
          <Heading as='h2' size='md' mb={4}>
            스케줄
          </Heading>
          <FormControl id='schedule' mb={4}>
            <FormLabel>스케줄</FormLabel>
            <Textarea
              height='100px'
              value={schedule}
              name='schedule'
              onChange={onChange}
              width='100%'
            />
          </FormControl>
          <FormControl mb='20px'>
            <FormLabel>스케줄 이미지 업로드</FormLabel>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              {scheduleImageName && scheduleImageUrl ? (
                <>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    onClick={() => openPopup(scheduleImageUrl)}
                  >
                    {scheduleImageName}
                  </Text>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onScheduleFileChange}
                    display='none'
                    id='schedule-image-upload'
                  />
                  <label htmlFor='schedule-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              ) : (
                <>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={onScheduleFileChange}
                    display='none'
                    id='schedule-image-upload'
                  />
                  <label htmlFor='schedule-image-upload'>
                    <Box
                      width='30px'
                      height='30px'
                      border='1px dashed gray'
                      backgroundColor='gray.200'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      cursor='pointer'
                    >
                      <Text fontSize='xl'>+</Text>
                    </Box>
                  </label>
                </>
              )}
            </Box>
          </FormControl>
        </Box>
      </Box>
    </form>
  );
};

export default PlanForm;
