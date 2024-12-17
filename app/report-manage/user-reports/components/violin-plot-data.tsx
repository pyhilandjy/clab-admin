import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

import { TokenziedSpeakerData } from '@/types/user_reports';

interface ViolinPlotDataProps {
  speakerData: TokenziedSpeakerData;
}

export default function ViolinPlotData({ speakerData }: ViolinPlotDataProps) {
  const { speaker, statistical_data } = speakerData;

  if (!statistical_data) {
    return (
      <Box borderWidth='1px' borderRadius='md' padding={4}>
        <Text
          fontWeight='bold'
          fontSize='lg'
          marginBottom={4}
          textAlign='center'
        >
          No data available for {speaker}
        </Text>
      </Box>
    );
  }

  return (
    <Box borderWidth='1px' borderRadius='md' padding={4}>
      {/* <Text fontWeight='bold' fontSize='lg' marginBottom={4} textAlign='center'>
        {speaker}
      </Text> */}
      <Table variant='simple' size='sm'>
        <Thead>
          <Tr>
            {/* 첫 번째 행에 Key 값들을 표시 */}
            <Th textAlign='center'>Speaker</Th>
            {Object.keys(statistical_data).map((key) => (
              <Th key={key} textAlign='center'>
                {key}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {/* 두 번째 행에 데이터 값 표시 */}
            <Td textAlign='center'>{speaker}</Td>
            {Object.values(statistical_data).map((value, index) => (
              <Td key={index} textAlign='center'>
                {value}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
