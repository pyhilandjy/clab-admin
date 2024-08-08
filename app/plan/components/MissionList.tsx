import React, { useState } from 'react';
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

type Mission = {
  id: string;
  title: string;
  status: string;
};

type MissionListProps = {
  missions: Mission[];
  isOpen: boolean;
  onCreateMission: () => void;
  onEditMission: (id: string) => void;
  onDeleteMission: (id: string) => void;
};

const MissionList: React.FC<MissionListProps> = ({
  missions,
  isOpen,
  onCreateMission,
  onEditMission,
  onDeleteMission,
}) => {
  const [missionStatuses, setMissionStatuses] = useState(
    missions.reduce((acc, mission) => {
      acc[mission.id] = mission.status;
      return acc;
    }, {} as Record<string, string>)
  );

  const handleStatusChange = (id: string, newStatus: string) => {
    setMissionStatuses((prevStatuses) => ({
      ...prevStatuses,
      [id]: newStatus,
    }));
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
                      aria-label='미션 수전'
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
