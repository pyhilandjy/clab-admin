'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';

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
  HStack,
} from '@chakra-ui/react';

import {
  fetchPlans,
  fetchMission,
  updatePlanStatus,
  deletePlan,
} from '@/api/plan';
import { fetchReports } from '@/api/report';
import { Mission } from '@/types/mission';
import { Plan } from '@/types/plan';
import { ReportWithMissions } from '@/types/report';

import MissionList from './_components/mission/MissionList';
import ReportList from './_components/report/ReportList';
import Layout from '../../components/Layout';

const PlanPage = () => {
  const router = useRouter();
  const handleAddPlan = () => {
    router.push('/plan/add');
  };
  const [plans, setPlans] = useState<Plan[]>([]);
  const [missions, setMissions] = useState<{ [key: string]: Mission[] }>({});
  const [reports, setReports] = useState<{
    [key: string]: ReportWithMissions[];
  }>({});
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [isMissionVisible, setIsMissionVisible] = useState<boolean>(false);
  const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await fetchPlans();
        setPlans(response.data);
      } catch (error) {
        console.error('플랜을 불러오는 중 오류가 발생했습니다:', error);
      }
    };
    loadPlans();
  }, []);

  const handleNameClick = (planId: string) => {
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
      setIsMissionVisible(false);
      setIsReportVisible(false);
    } else {
      setExpandedPlanId(planId);
      setIsMissionVisible(false);
      setIsReportVisible(false);
      handleMissionClick(planId);
    }
  };

  const handleMissionClick = async (planId: string) => {
    if (isMissionVisible) {
      setIsMissionVisible(false);
    } else {
      setIsReportVisible(false);

      if (!missions[planId]) {
        try {
          const response = await fetchMission(planId);
          setMissions((prevMissions) => ({
            ...prevMissions,
            [planId]: response.data,
          }));
        } catch (error) {
          console.error(`Error fetching missions for plan ${planId}:`, error);
        }
      }
      setIsMissionVisible(true);
    }
  };

  const handleReportClick = async (planId: string) => {
    if (isReportVisible) {
      setIsReportVisible(false);
    } else {
      setIsMissionVisible(false);

      if (!reports[planId]) {
        try {
          const reportResponse = await fetchReports(planId);
          setReports((prevReports) => ({
            ...prevReports,
            [planId]: reportResponse,
          }));
        } catch (error) {
          console.error(`Error fetching reports for plan ${planId}:`, error);
        }
      }
      setIsReportVisible(true);
    }
  };

  const handleStatusChange = async (planId: string, newStatus: string) => {
    try {
      await updatePlanStatus(planId, newStatus);
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan.id === planId ? { ...plan, status: newStatus } : plan,
        ),
      );
    } catch (error) {
      console.error(`Error updating status for plan ${planId}:`, error);
    }
  };

  const handleDeletePlan = async () => {
    if (selectedPlanId) {
      try {
        const response = await deletePlan(selectedPlanId);
        if (response.data.Code === '0') {
          setPlans((prevPlans) =>
            prevPlans.filter((plan) => plan.id !== selectedPlanId),
          );
        } else if (response.data.Code === '1001') {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(`Error deleting plan ${selectedPlanId}:`, error);
        alert('패키지 삭제 중 오류가 발생했습니다.');
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
        (mission) => mission.id !== missionId,
      ),
    }));
  };

  const handleMissionAdd = async (planId: string) => {
    try {
      const response = await fetchMission(planId);
      setMissions((prevMissions) => ({
        ...prevMissions,
        [planId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching missions for plan ${planId}:`, error);
    }
  };

  const handleReportAdd = async (planId: string) => {
    try {
      const response = await fetchReports(planId);
      setReports((prevReports) => ({
        ...prevReports,
        [planId]: response,
      }));
    } catch (error) {
      console.error(`Error fetching reports for plan ${planId}:`, error);
    }
  };

  const handleReportDeleteSuccess = (planId: string, reportId: string) => {
    setReports((prevReports) => ({
      ...prevReports,
      [planId]: prevReports[planId].filter(
        (report) => report.report.id !== reportId,
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
        <Box
          p={4}
          width='75vw'
          maxWidth='1600px'
          bg='white'
          borderRadius='md'
          border='1px solid'
          borderColor='gray.200'
        >
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th width='200px'>패키지명</Th>
                <Th width='100px'>미션 갯수</Th>
                <Th width='180px'>상태</Th>
                <Th width='700px'>설명</Th>
                <Th width='200px'></Th>
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
                        <option value='ACTIVE'>활성화</option>
                        <option value='INACTIVE'>비활성화</option>
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
                  {expandedPlanId === plan.id && (
                    <Tr>
                      <Td colSpan={5} p={0}>
                        <Box p={4}>
                          <HStack spacing={4} mb={4}>
                            <Button
                              colorScheme='orange'
                              onClick={() => handleMissionClick(plan.id)}
                            >
                              미션
                            </Button>
                            <Button
                              colorScheme='orange'
                              onClick={() => handleReportClick(plan.id)}
                            >
                              리포트
                            </Button>
                          </HStack>
                          {isMissionVisible && (
                            <MissionList
                              missions={missions[plan.id] ?? []}
                              isOpen={isMissionVisible}
                              onDeleteSuccess={(missionId) =>
                                handleMissionDeleteSuccess(plan.id, missionId)
                              }
                              planId={plan.id}
                              onAddMission={() => handleMissionAdd(plan.id)}
                            />
                          )}
                          {isReportVisible && (
                            <ReportList
                              reports={reports[plan.id] ?? []}
                              planId={plan.id}
                              isOpen={isReportVisible}
                              missions={missions[plan.id] ?? []}
                              onAddReport={() => handleReportAdd(plan.id)}
                              onDeleteSuccess={(reportId) =>
                                handleReportDeleteSuccess(plan.id, reportId)
                              }
                            />
                          )}
                        </Box>
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
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
                <Button colorScheme='red' onClick={handleDeletePlan} ml={3}>
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
