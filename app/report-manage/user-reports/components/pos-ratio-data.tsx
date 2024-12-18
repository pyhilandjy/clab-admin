import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

import { PosRatioSpeakerData } from '@/types/user_reports';

interface PosRatioDataProps {
  speakerData: PosRatioSpeakerData;
}

export default function PosRatioDatas({ speakerData }: PosRatioDataProps) {
  const { speaker, pos_ratio_data } = speakerData;

  if (!pos_ratio_data) {
    return (
      <Box borderWidth='1px' borderRadius='md' padding={4}>
        <Text fontWeight='bold' fontSize='lg' marginBottom={4}>
          No data available for {speaker}
        </Text>
      </Box>
    );
  }

  // 모든 값의 합계를 계산
  const totalWords = Object.values(pos_ratio_data).reduce(
    (sum, value) => sum + Number(value),
    0,
  );

  return (
    <Box borderWidth='1px' borderRadius='md' padding={4}>
      <Table variant='simple' size='sm'>
        <Thead>
          <Tr>
            <Th textAlign='center'>Speaker</Th>
            {Object.keys(pos_ratio_data).map((key) => (
              <Th key={key} textAlign='center'>
                {key}
              </Th>
            ))}
            <Th textAlign='center'>총단어 수</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td textAlign='center'>{speaker}</Td>
            {Object.values(pos_ratio_data).map((value, index) => (
              <Td key={index} textAlign='center'>
                {value}
              </Td>
            ))}
            <Td textAlign='center'>{totalWords}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
