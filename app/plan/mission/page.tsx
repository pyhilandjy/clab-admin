import React, { useState, useEffect } from 'react';
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
};

type MissionListProps = {
  missions: Mission[];
  isOpen: boolean;
  onDeleteSuccess: (missionId: string) => void; // 미션 삭제 후 성공적으로 삭제된 것을 부모 컴포넌트에 알리기 위한 콜백
};

const MissionList: React.FC<MissionListProps> = ({
  missions,
  isOpen,
  onDeleteSuccess,
}) => {
  const [missionStatuses, setMissionStatuses] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const initialStatuses = missions.reduce((acc, mission) => {
      acc[mission.id] = mission.status;
      return acc;
    }, {} as Record<string, string>);
    setMissionStatuses(initialStatuses);
  }, [missions]);

  const onCreateMission = () => {
    console.log('미션 추가');
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
        onDeleteSuccess(id); // 부모 컴포넌트에 미션 삭제 성공 알림
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
      <Box p={4} bg='gray.50'>
        <HStack justifyContent='space-between' mb={4}>
          <Button colorScheme='teal' onClick={onCreateMission}>
            미션 추가
          </Button>
        </HStack>
        <Table size='sm' variant='simple'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {missions.map((mission) => (
              <Tr key={mission.id}>
                <Td>{mission.title}</Td>
                <Td>
                  <Select
                    size='sm'
                    value={missionStatuses[mission.id]} // 기본값을 DB에서 불러온 값으로 설정
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
