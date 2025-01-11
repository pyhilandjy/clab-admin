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

import { deleteMission, updateMissionStatus } from '@/api/mission';
import { Mission, MissionListProps } from '@/types/mission';

import AddMissionPage from './AddMissonPage';
import EditMissionPage from './EditMissionPage';

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
      await deleteMission(id);
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
      await updateMissionStatus(id, newStatus);
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
        <Box
          p={4}
          width='70vw'
          maxWidth='1300px'
          bg='gray.50'
          borderRadius='md'
          border='1px solid'
          borderColor='gray.200'
        >
          <HStack justifyContent='space-between' mb={4}>
            <Button colorScheme='blue' onClick={onAddModalOpen}>
              미션 추가
            </Button>
          </HStack>
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                <Th>순서</Th>
                <Th>미션명</Th>
                <Th>요약</Th>
                <Th>상태</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {missions
                .sort((a, b) => Number(a.day) - Number(b.day))
                .map((mission) => (
                  <Tr key={mission.id}>
                    <Td>{mission.day}</Td>
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
                        <option value='active'>활성화</option>
                        <option value='inactive'>비활성화</option>
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
