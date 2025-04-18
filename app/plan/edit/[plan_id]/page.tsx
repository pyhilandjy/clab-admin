'use client';

import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  updatePlan,
  fetchPlan,
  fetchSubCategories,
  fetchCategories,
  uploadDescriptionImage,
  uploadThumbnailImage,
  uploadScheduleImage,
} from '@/api/plan';
import Layout from '@/components/Layout';
import { Category, UpdatePlanPayload } from '@/types/plan';

import PlanForm from '../../_components/PlanForm';

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
  const router = useRouter();
  const { plan_id } = useParams();

  useEffect(() => {
    const loadPlanData = async () => {
      try {
        const planResponse = await fetchPlan(plan_id as string);
        const plan = planResponse.data;

        setPlanName(plan.plan_name || '');
        setPrice(plan.price ? plan.price.toString() : '');
        setStartAgeMonth(
          plan.start_age_month ? plan.start_age_month.toString() : '',
        );
        setEndAgeMonth(plan.end_age_month ? plan.end_age_month.toString() : '');
        setDay(plan.day ? plan.day.toString() : '');
        setDescription(plan.description || '');
        setType(plan.type || '');
        setTags(plan.tags ? plan.tags.join(', ') : '');
        setSelectedSubCategory(plan.category_id);
        setSummary(plan.summary || '');
        setDescriptionImageName(plan.description_image_name || null);
        setDescriptionImageUrl(plan.description_image_id_url || null);
        setThumbnailImageName(plan.thumbnail_image_name || null);
        setThumbnailImageUrl(plan.thumbnail_image_id_url || null);
        setSchedule(plan.schedule || '');
        setScheduleImageName(plan.schedule_image_name || null);
        setScheduleImageUrl(plan.schedule_image_id_url || null);

        const mainCategoriesResponse = await fetchCategories();
        setMainCategories(mainCategoriesResponse.data);

        let foundMainCategory: Category | undefined;
        let foundSubCategory: Category | undefined;

        for (const mainCategory of mainCategoriesResponse.data) {
          const subCategory = mainCategory.sub_categories?.find(
            (sub) => sub.id === plan.category_id,
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
        } else {
          const subCategoriesResponse = await fetchSubCategories(
            plan.category_id,
          );
          setSubCategories(subCategoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching plan data:', error);
      }
    };

    loadPlanData();
  }, [plan_id]);

  const handleDescriptionFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setDescriptionImageName(file.name);
        setDescriptionImageUrl(reader.result as string);
        await uploadDescriptionImage(plan_id as string, file.name, file);
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
        await uploadThumbnailImage(plan_id as string, file.name, file);
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
        await uploadScheduleImage(plan_id as string, file.name, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const payload: UpdatePlanPayload = {
      id: plan_id as string,
      plan_name: planName,
      price: price !== null ? parseInt(price) : null,
      start_age_month: startAgeMonth !== null ? parseInt(startAgeMonth) : null,
      end_age_month: endAgeMonth !== null ? parseInt(endAgeMonth) : null,
      day: day !== null ? parseInt(day) : null,
      description,
      type,
      tags: tagsArray,
      category_id: selectedSubCategory,
      summary,
      schedule,
    };

    try {
      await updatePlan(plan_id as string, payload);
      alert('플랜 수정이 완료되었습니다.');
      router.push('/plan');
    } catch (error) {
      console.error('Error updating plan:', error);
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
        descriptionImageUrl={descriptionImageUrl}
        thumbnailImageName={thumbnailImageName}
        thumbnailImageUrl={thumbnailImageUrl}
        schedule={schedule}
        scheduleImageName={scheduleImageName}
        scheduleImageUrl={scheduleImageUrl}
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
        handleMainCategoryChange={(mainCategoryId: string) => {
          setSelectedMainCategory(mainCategoryId);
          fetchSubCategories(mainCategoryId).then((res) =>
            setSubCategories(res.data),
          );
        }}
        onSubCategoryChange={(e) => setSelectedSubCategory(e.target.value)}
        onDescriptionFileChange={handleDescriptionFileChange}
        onThumbnailFileChange={handleThumbnailFileChange}
        onScheduleFileChange={handleScheduleFileChange}
        isEdit={true}
      />
    </Layout>
  );
};

export default EditPlanPage;
