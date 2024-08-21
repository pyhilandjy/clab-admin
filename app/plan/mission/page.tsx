import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import api from '@/lib/api';

type Mission = {
  id: string;
  title: string;
  status: string;
  summation: string;
};

type MissionListProps = {
  missions: Mission[];
  isOpen: boolean;
  onDeleteSuccess: (missionId: string) => void;
};

const MissionList: React.FC<MissionListProps> = ({
  missions,
  isOpen,
  onDeleteSuccess,
}) => {
  const [missionStatuses, setMissionStatuses] = useState<
    Record<string, string>
  >({});

  const router = useRouter();

  useEffect(() => {
    const initialStatuses = missions.reduce((acc, mission) => {
      acc[mission.id] = mission.status;
      return acc;
    }, {} as Record<string, string>);
    setMissionStatuses(initialStatuses);
  }, [missions]);

  const onCreateMission = () => {
    router.push('/plan/mission/add');
  };

  const onEditMission = (id: string) => {
    console.log('미션 수정:', id);
  };

  const onDeleteMission = async (id: string) => {
    const confirmDelete = confirm('미션을 삭제하시면 메세지도 삭제됩니다.');
    if (confirmDelete) {
      try {
        await api.delete(`/missions/${id}`);
        alert('미션이 성공적으로 삭제되었습니다.');
        onDeleteSuccess(id);
      } catch (error) {
        console.error(`미션 삭제 중 오류 발생:`, error);
        alert('미션 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/missions/status/`, { id, status: newStatus });
      setMissionStatuses((prevStatuses) => ({
        ...prevStatuses,
        [id]: newStatus,
      }));
    } catch (error) {
      console.error(`미션 상태 변경 중 오류 발생:`, error);
      alert('미션 상태 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box p={4} width='70vw' maxWidth='1200px'>
        <HStack justifyContent='space-between' mb={4}>
          <Button colorScheme='teal' onClick={onCreateMission}>
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
                      onClick={() => onEditMission(mission.id)}
                    />
                    <IconButton
                      size='sm'
                      colorScheme='red'
                      aria-label='미션 삭제'
                      icon={<DeleteIcon />}
                      onClick={() => onDeleteMission(mission.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Collapse>
  );
};

export default MissionList;
