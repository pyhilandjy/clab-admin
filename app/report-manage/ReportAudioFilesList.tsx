'use client';

import React, { useEffect, useState } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Collapse,
  Box,
  Text,
  Spinner,
  Switch,
  HStack,
} from '@chakra-ui/react';

import {
  fetchReportAudioFiles,
  updateAudioFileIsUsed,
} from '@/api/report-management';
import { ReportAudioFile } from '@/types/report-management';

type ReportAudioFilesListProps = {
  userReportsId: string;
  isExpanded: boolean;
};

const ReportAudioFilesList: React.FC<ReportAudioFilesListProps> = ({
  userReportsId,
  isExpanded,
}) => {
  const [audioFiles, setAudioFiles] = useState<ReportAudioFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      setIsLoading(true);
      fetchReportAudioFiles(userReportsId)
        .then((data) => setAudioFiles(data))
        .catch((error) => console.error('Error fetching audio files:', error))
        .finally(() => setIsLoading(false));
    }
  }, [isExpanded, userReportsId]);

  const handleToggle = async (audioFileId: string, currentValue: boolean) => {
    try {
      await updateAudioFileIsUsed(audioFileId, !currentValue);

      setAudioFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.audio_file_id === audioFileId
            ? { ...file, is_used: !currentValue }
            : file,
        ),
      );
    } catch (error) {
      console.error('Error updating audio file:', error);
    }
  };

  return (
    <Collapse in={isExpanded} animateOpacity>
      <Box
        border='1px solid #EAECF0'
        borderRadius='8px'
        p={4}
        mt={2}
        backgroundColor='#F9FAFB'
      >
        {isLoading ? (
          <Spinner />
        ) : audioFiles.length > 0 ? (
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>녹음일시</Th>
                  <Th>총 녹음시간</Th>
                  <Th>미션명</Th>
                  <Th>레포트 사용 여부</Th>
                </Tr>
              </Thead>
              <Tbody>
                {audioFiles.map((file) => (
                  <Tr key={file.audio_file_id}>
                    <Td>{new Date(file.record_date).toLocaleString()}</Td>
                    <Td>{file.record_time}</Td>
                    <Td>{file.mission_title}</Td>
                    <Td>
                      <HStack align='center'>
                        <Text>{file.is_used ? '활성화' : '비활성화'}</Text>
                        <Switch
                          size='md'
                          isChecked={file.is_used}
                          onChange={() =>
                            handleToggle(file.audio_file_id, file.is_used)
                          }
                          colorScheme='teal'
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>No audio files available.</Text>
        )}
      </Box>
    </Collapse>
  );
};

export default ReportAudioFilesList;
