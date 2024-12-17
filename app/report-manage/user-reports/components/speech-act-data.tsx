import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';
import { SpeechActSpeakerData } from '@/types/user_reports';

interface SpeechActTableProps {
  speakerData: SpeechActSpeakerData;
}

export default function SpeechActTable({ speakerData }: SpeechActTableProps) {
  const { speaker, speech_act } = speakerData;

  // 특정 mood 데이터를 가져오기
  const getMoodData = (mood: string) => {
    const moodData = speech_act.find((sa) => sa[mood]);
    return moodData ? moodData[mood] : {};
  };

  // 모든 act_name 추출
  const getActNames = (mood: string) => {
    const moodData = getMoodData(mood);
    return Object.keys(moodData);
  };

  // 가까워져요와 멀어져요 데이터
  const 가까워져요 = getMoodData('가까워져요');
  const 멀어져요 = getMoodData('멀어져요');

  const renderTable = (title: string, moodData: Record<string, number>) => {
    const actNames = Object.keys(moodData);

    return (
      <Box mb={6}>
        <Text fontWeight='bold' fontSize='lg' mb={2}>
          {title}
        </Text>
        <Table variant='simple' size='sm'>
          <Thead>
            <Tr>
              <Th>Act Name</Th>
              <Th textAlign='center'>Count</Th>
            </Tr>
          </Thead>
          <Tbody>
            {actNames.length > 0 ? (
              actNames.map((actName) => (
                <Tr key={actName}>
                  <Td>{actName}</Td>
                  <Td textAlign='center'>{moodData[actName]}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={2} textAlign='center'>
                  No Data Available
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    );
  };

  return (
    <Box borderWidth='1px' borderRadius='md' padding={4} mb={4}>
      <Text fontWeight='bold' fontSize='xl' mb={4}>
        Speech Act Data for {speaker}
      </Text>

      {/* 가까워져요 테이블 */}
      {renderTable('가까워져요', 가까워져요)}

      <Divider />

      {/* 멀어져요 테이블 */}
      {renderTable('멀어져요', 멀어져요)}
    </Box>
  );
}
