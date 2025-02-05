'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Heading,
} from '@chakra-ui/react';

import {
  fetchPlan,
  uploadDescriptionImage,
  uploadThumbnailImage,
  uploadScheduleImage,
} from '@/api/plan';

const Page = () => {
  const planId = 'e92bc7e4-0189-411e-857c-7aba661bb5d6';
  const [description, setDescription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [descriptionImageName, setDescriptionImageName] = useState<
    string | null
  >(null);
  const [descriptionImageUrl, setDescriptionImageUrl] = useState<string | null>(
    null,
  );
  const [thumbnailImageName, setThumbnailImageName] = useState<string | null>(
    null,
  );
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null,
  );
  const [schedule, setSchedule] = useState<string>('');
  const [scheduleImageName, setScheduleImageName] = useState<string | null>(
    null,
  );
  const [scheduleImageUrl, setScheduleImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPlan = async () => {
      const planId = 'e92bc7e4-0189-411e-857c-7aba661bb5d6';
      const response = await fetchPlan(planId);
      const plan = response.data;
      if (plan.description) {
        setDescription(plan.description);
      }
      if (plan.summary) {
        setSummary(plan.summary);
      }
      if (plan.description_image_id_url) {
        setDescriptionImageName(plan.description_image_name as string | null);
        setDescriptionImageUrl(plan.description_image_id_url as string | null);
      }
      if (plan.thumbnail_image_id_url) {
        setThumbnailImageName(plan.thumbnail_image_name as string | null);
        setThumbnailImageUrl(plan.thumbnail_image_id_url as string | null);
      }
      if (plan.schedule) {
        setSchedule(plan.schedule);
      }
      if (plan.schedule_image_id_url) {
        setScheduleImageName(plan.schedule_image_name as string | null);
        setScheduleImageUrl(plan.schedule_image_id_url as string | null);
      }
    };
    loadPlan();
  }, []);

  const handleDescriptionFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setDescriptionImageName(file.name);
        setDescriptionImageUrl(reader.result as string);
        await uploadDescriptionImage(planId, file.name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setThumbnailImageName(file.name);
        setThumbnailImageUrl(reader.result as string);
        await uploadThumbnailImage(planId, file.name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScheduleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setScheduleImageName(file.name);
        setScheduleImageUrl(reader.result as string);
        await uploadScheduleImage(planId, file.name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (description && summary) {
      const formData = {
        detail: description,
        summary: summary,
        schedule: schedule,
      };
      console.log('Form Data:', formData);
    } else {
      console.log('All fields are required.');
    }
  };

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
    <Box as='form' onSubmit={handleSave} p='20px' maxW='600px' mx='auto'>
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
                  onChange={handleThumbnailFileChange}
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
                  onChange={handleThumbnailFileChange}
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
            onChange={(e) => setDescription(e.target.value)}
            width='100%'
          />
        </FormControl>
        <FormControl id='summary' mb={4}>
          <FormLabel>요약</FormLabel>
          <Textarea
            height='100px'
            value={summary}
            name='summary'
            onChange={(e) => setSummary(e.target.value)}
            width='100%'
          />
        </FormControl>
        <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} mb={4}>
          <FormControl mb='20px'>
            <FormLabel>이미지 업로드</FormLabel>
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
                    onChange={handleDescriptionFileChange}
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
                    onChange={handleDescriptionFileChange}
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
            onChange={(e) => setSchedule(e.target.value)}
            width='100%'
          />
        </FormControl>
        <Box border='1px' borderColor='gray.200' borderRadius='md' p={4} mb={4}>
          <FormControl mb='20px'>
            <FormLabel>이미지 업로드</FormLabel>
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
                    onChange={handleScheduleFileChange}
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
                    onChange={handleScheduleFileChange}
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
      <Button type='submit' colorScheme='blue' size='lg'>
        Save
      </Button>
    </Box>
  );
};

export default Page;
