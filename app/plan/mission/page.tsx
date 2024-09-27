'use client';
import React, { useState, useEffect } from 'react';

import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
  Select,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import api from '@/lib/api';

import AddMissionPage from './_components/AddMissonPage';
import EditMissionPage from './_components/EditMissionPage';

type Mission = {
  id: string;
  title: string;
  status: string;
  summation: string;
  day: string;
  message: string;
};

type MissionListProps = {
  missions: Mission[];
  isOpen: boolean;
  onDeleteSuccess: (missionId: string) => void;
  planId: string;
  onAddMission: () => Promise<void>;
};

const MissionList: React.FC<MissionListProps> = ({
  missions,
  isOpen,
  onDeleteSuccess,
  planId,
  onAddMission,
}) => {
  const [missionStatuses, setMissionStatuses] = useState<
    Record<string, string>
  >({});
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const toast = useToast();

  useEffect(() => {
    const initialStatuses = missions.reduce(
      (acc, mission) => {
        acc[mission.id] = mission.status;
        return acc;
      },
      {} as Record<string, string>,
    );
    setMissionStatuses(initialStatuses);
  }, [missions]);

  const handleMissionSave = async () => {
    await onAddMission();
    onAddModalClose();
  };

  const handleEditMission = (mission: Mission) => {
    setSelectedMission(mission);
    onEditModalOpen();
  };

  const handleMissionUpdate = async () => {
    await onAddMission();
    onEditModalClose();
  };

  const handleDeleteMission = async (id: string) => {
    const confirmDelete = confirm('정말로 이 미션을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/missions/${id}`);
      onDeleteSuccess(id);
      toast({
        title: '미션이 성공적으로 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast({
        title: '미션 삭제 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/missions/status/`, { id, status: newStatus });
      setMissionStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: newStatus,
      }));
      toast({
        title: '미션 상태가 성공적으로 변경되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating mission status:', error);
      toast({
        title: '미션 상태 변경 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Collapse in={isOpen} animateOpacity>
        <Box p={4} width='70vw' maxWidth='1200px'>
          <HStack justifyContent='space-between' mb={4}>
            <Button colorScheme='blue' onClick={onAddModalOpen}>
              미션 추가
            </Button>
          </HStack>
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                <Th>미션명</Th>
                <Th>요약</Th>
                <Th>상태</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {missions.map((mission) => (
                <Tr key={mission.id}>
                  <Td>{mission.title}</Td>
                  <Td>{mission.summation}</Td>
                  <Td>
                    <Select
                      size='sm'
                      value={missionStatuses[mission.id]}
                      onChange={(e) =>
                        handleStatusChange(mission.id, e.target.value)
                      }
                    >
                      <option value='active'>Active</option>
                      <option value='inactive'>Inactive</option>
                    </Select>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        size='sm'
                        colorScheme='blue'
                        aria-label='미션 수정'
                        icon={<EditIcon />}
                        onClick={() => handleEditMission(mission)}
                      />
                      <IconButton
                        size='sm'
                        colorScheme='red'
                        aria-label='미션 삭제'
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteMission(mission.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Collapse>

      {/* 미션 추가 모달 */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size='5xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>미션 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddMissionPage
              onClose={onAddModalClose}
              planId={planId}
              onSave={handleMissionSave}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 미션 수정 모달 */}
      {selectedMission && (
        <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size='5xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>미션 수정</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EditMissionPage
                onClose={onEditModalClose}
                mission={selectedMission}
                onSave={handleMissionUpdate}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default MissionList;
