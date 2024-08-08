import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
} from '@chakra-ui/react';

type Mission = {
  id: string;
  title: string;
  status: string;
};

type MissionListProps = {
  missions: Mission[];
  isOpen: boolean;
};

const MissionList: React.FC<MissionListProps> = ({ missions, isOpen }) => {
  return (
    <Collapse in={isOpen} animateOpacity>
      <Box p={4} bg='gray.50'>
        <Table size='sm' variant='simple'>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {missions.map((mission) => (
              <Tr key={mission.id}>
                <Td>{mission.title}</Td>
                <Td>{mission.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Collapse>
  );
};

export default MissionList;
