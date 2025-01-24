'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  createPlan,
  fetchMainCategories,
  fetchSubCategories,
} from '@/api/plan';
import { Category } from '@/types/plan';

import Layout from '../../../components/Layout';
import PlanForm from '../_components/PlanForm';

const AddPlanPage = () => {
  const [planName, setPlanName] = useState<string>('');
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
  const [summary, setSummary] = useState<string>('');
  const [descriptionImageName, setDescriptionImageName] = useState<
    string | null
  >(null);
  const [descriptionImageFile, setDescriptionImageFile] = useState<File | null>(
    null,
  );
  const [thumbnailImageName, setThumbnailImageName] = useState<string | null>(
    null,
  );
  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(
    null,
  );
  const [schedule, setSchedule] = useState<string>('');
  const [scheduleImageName, setScheduleImageName] = useState<string | null>(
    null,
  );
  const [scheduleImageFile, setScheduleImageFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const mainCategoriesResponse = await fetchMainCategories();
        setMainCategories(mainCategoriesResponse.data);
      } catch (error) {
        console.error('Error fetching main categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleMainCategoryChange = async (mainCategoryId: string) => {
    setSelectedMainCategory(mainCategoryId);
    setSelectedSubCategory('');
    try {
      const subCategoriesResponse = await fetchSubCategories(mainCategoryId);
      setSubCategories(subCategoriesResponse.data);
    } catch (error) {
      console.error('Error fetching sub categories:', error);
    }
  };

  const handleDescriptionFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDescriptionImageName(file.name);
      setDescriptionImageFile(file);
    }
  };

  const handleThumbnailFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailImageName(file.name);
      setThumbnailImageFile(file);
    }
  };

  const handleScheduleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setScheduleImageName(file.name);
      setScheduleImageFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const formData = new FormData();
    formData.append('plan_name', planName);
    console.log('planName:', planName);
    formData.append('price', price && parseInt(price).toString());
    formData.append(
      'start_age_month',
      startAgeMonth && parseInt(startAgeMonth).toString(),
    );
    formData.append(
      'end_age_month',
      endAgeMonth && parseInt(endAgeMonth).toString(),
    );
    formData.append('day', day !== null ? parseInt(day).toString() : '');
    formData.append('description', description);
    formData.append('type', type);
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('category_id', selectedSubCategory);
    formData.append('summary', summary);
    formData.append('schedule', schedule);
    if (descriptionImageFile) {
      formData.append('description_image', descriptionImageFile);
      formData.append('description_image_name', descriptionImageName as string);
    }
    if (thumbnailImageFile) {
      formData.append('thumbnail_image', thumbnailImageFile);
      formData.append('thumbnail_image_name', thumbnailImageName as string);
    }
    if (scheduleImageFile) {
      formData.append('schedule_image', scheduleImageFile);
      formData.append('schedule_image_name', scheduleImageName as string);
    }

    try {
      await createPlan(formData);
      alert('플랜이 성공적으로 추가되었습니다.');
      router.push('/plan');
    } catch (error) {
      console.error('Error adding plan:', error);
      alert('플랜 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <Layout>
      <PlanForm
        planName={planName}
        price={price}
        startAgeMonth={startAgeMonth}
        endAgeMonth={endAgeMonth}
        day={day}
        description={description}
        type={type}
        tags={tags}
        mainCategories={mainCategories}
        subCategories={subCategories}
        selectedMainCategory={selectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        summary={summary}
        descriptionImageName={descriptionImageName}
        descriptionImageUrl={
          descriptionImageFile
            ? URL.createObjectURL(descriptionImageFile)
            : null
        }
        thumbnailImageName={thumbnailImageName}
        thumbnailImageUrl={
          thumbnailImageFile ? URL.createObjectURL(thumbnailImageFile) : null
        }
        schedule={schedule}
        scheduleImageName={scheduleImageName}
        scheduleImageUrl={
          scheduleImageFile ? URL.createObjectURL(scheduleImageFile) : null
        }
        onChange={(e) => {
          const { name, value } = e.target;
          switch (name) {
            case 'planName':
              setPlanName(value);
              break;
            case 'price':
              setPrice(value);
              break;
            case 'startAgeMonth':
              setStartAgeMonth(value);
              break;
            case 'endAgeMonth':
              setEndAgeMonth(value);
              break;
            case 'day':
              setDay(value);
              break;
            case 'description':
              setDescription(value);
              break;
            case 'type':
              setType(value);
              break;
            case 'tags':
              setTags(value);
              break;
            case 'summary':
              setSummary(value);
              break;
            case 'schedule':
              setSchedule(value);
              break;
            default:
              break;
          }
        }}
        onSubmit={handleSubmit}
        handleMainCategoryChange={handleMainCategoryChange}
        onSubCategoryChange={(e) => setSelectedSubCategory(e.target.value)}
        onDescriptionFileChange={handleDescriptionFileChange}
        onThumbnailFileChange={handleThumbnailFileChange}
        onScheduleFileChange={handleScheduleFileChange}
      />
    </Layout>
  );
};

export default AddPlanPage;
