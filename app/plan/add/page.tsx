'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  createPlan,
  fetchMainCategories,
  fetchSubCategories,
} from '@/api/plan';
import { Category, CreatePlanPayload } from '@/types/plan';

import Layout from '../../../components/Layout';
import PlanForm from '../_components/PlanForm';

const AddPlanPage = () => {
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const tagsArray = tags.split(',').map((tag) => tag.trim());

    const payload: CreatePlanPayload = {
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
      await createPlan(payload);
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
            default:
              break;
          }
        }}
        onSubmit={handleSubmit}
        handleMainCategoryChange={handleMainCategoryChange}
        onSubCategoryChange={(e) => setSelectedSubCategory(e.target.value)}
      />
    </Layout>
  );
};

export default AddPlanPage;
