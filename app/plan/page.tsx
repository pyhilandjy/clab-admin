'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import Layout from '../../components/Layout';
import MissionList from './mission/page';
import api from '@/lib/api';

type Plan = {
  id: string;
  plan_name: string;
  status: string;
  description: string;
};

export type Mission = {
  id: string;
  title: string;
  status: string;
  summation: string;
};

const PlanPage = () => {
  const router = useRouter();
  const handleAddPlan = () => {
    router.push('/plan/add');
  };
  const [plans, setPlans] = useState<Plan[]>([]);
  const [missions, setMissions] = useState<{ [key: string]: Mission[] }>({});
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans/');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };
    fetchPlans();
  }, []);

  const handleNameClick = async (planId: string) => {
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
    } else {
      if (!missions[planId]) {
        try {
          const response = await api.get(`/missions/${planId}`);
          setMissions((prevMissions) => ({
            ...prevMissions,
            [planId]: response.data,
          }));
          setExpandedPlanId(planId);
        } catch (error) {
          console.error(`Error fetching missions for plan ${planId}:`, error);
        }
      } else {
        setExpandedPlanId(planId);
      }
    }
  };

  const handleStatusChange = async (planId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/plan/status/`, {
        id: planId,
        status: newStatus,
      });
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId ? { ...plan, status: newStatus } : plan
        )
      );
    } catch (error) {
      console.error(`Error updating status for plan ${planId}:`, error);
    }
  };

  const handleDelete = async () => {
    if (selectedPlanId) {
      try {
        const response = await api.delete(`/plans/${selectedPlanId}`);
        if (response.data.Code === '0') {
          setPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== selectedPlanId)
          );
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(`Error deleting plan ${selectedPlanId}:`, error);
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage =
          axiosError.response?.data?.message ||
          '패키지 삭제 중 오류가 발생했습니다.';
        alert(errorMessage);
      } finally {
        setIsOpen(false);
        setSelectedPlanId(null);
      }
    }
  };

  const openDeleteModal = (planId: string) => {
    setSelectedPlanId(planId);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setSelectedPlanId(null);
  };

  const handleEditPlan = (planId: string) => {
    router.push(`/plan/edit/${planId}`);
  };

  const handleMissionDeleteSuccess = (planId: string, missionId: string) => {
    setMissions((prevMissions) => ({
      ...prevMissions,
      [planId]: prevMissions[planId].filter(
        (mission) => mission.id !== missionId
      ),
    }));
  };

  return (
    <Layout>
      <Box p={4}>
        <Heading as='h1' mb={4}>
          Plans
        </Heading>
        <Button colorScheme='blue' mb={4} onClick={handleAddPlan}>
          플랜 추가
        </Button>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>패키지명</Th>
              <Th>미션 갯수</Th>
              <Th>상태</Th>
              <Th>설명</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {plans.map((plan) => (
              <React.Fragment key={plan.id}>
                <Tr>
                  <Td
                    onClick={() => handleNameClick(plan.id)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    {plan.plan_name}
                  </Td>
                  <Td>{missions[plan.id]?.length ?? 0}</Td>
                  <Td>
                    <Select
                      value={plan.status}
                      onChange={(e) =>
                        handleStatusChange(plan.id, e.target.value)
                      }
                    >
                      <option value='active'>Active</option>
                      <option value='inactive'>Inactive</option>
                    </Select>
                  </Td>
                  <Td>{plan.description}</Td>
                  <Td>
                    <Button
                      colorScheme='teal'
                      size='sm'
                      mr={2}
                      onClick={() => handleEditPlan(plan.id)}
                    >
                      수정
                    </Button>
                    <Button
                      colorScheme='red'
                      size='sm'
                      onClick={() => openDeleteModal(plan.id)}
                    >
                      삭제
                    </Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={5} p={0}>
                    <MissionList
                      missions={missions[plan.id] ?? []}
                      isOpen={expandedPlanId === plan.id}
                      onDeleteSuccess={(missionId) =>
                        handleMissionDeleteSuccess(plan.id, missionId)
                      }
                    />
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeDeleteModal}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                패키지 삭제
              </AlertDialogHeader>
              <AlertDialogBody>정말로 삭제하시겠습니까?</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeDeleteModal}>
                  아니요
                </Button>
                <Button colorScheme='red' onClick={handleDelete} ml={3}>
                  삭제
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Layout>
  );
};

export default PlanPage;
