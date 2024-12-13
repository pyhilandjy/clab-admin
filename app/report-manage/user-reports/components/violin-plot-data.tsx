import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';
import { TokenziedSpeakerData } from '@/types/user_reports';

interface ViolinPlotDataProps {
  speakerData: TokenziedSpeakerData;
}

export default function ViolinPlotData({ speakerData }: ViolinPlotDataProps) {
  const { speaker, statistical_data } = speakerData;

  return (
    <Box borderWidth='1px' borderRadius='md' padding={4}>
      <Text fontWeight='bold' fontSize='lg' marginBottom={4}>
        {speaker}
      </Text>
      <Table variant='simple' size='sm'>
        <Thead>
          <Tr>
            <Th>Metric</Th>
            <Th isNumeric>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(statistical_data).map(([key, value]) => (
            <Tr key={key}>
              <Td>{key}</Td>
              <Td isNumeric>{value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
