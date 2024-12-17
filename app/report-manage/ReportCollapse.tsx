'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';

import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
  HStack,
  Switch,
  Button,
  Text,
  Spinner,
} from '@chakra-ui/react';

import {
  fetchReportAudioFiles,
  updateAudioFileIsUsed,
} from '@/api/report-management';
import { ReportAudioFile } from '@/types/report-management';

interface ReportCollapseProps {
  userReportsId: string;
  isExpanded: boolean;
}

const ReportCollapse: React.FC<ReportCollapseProps> = memo(
  ({ userReportsId, isExpanded }) => {
    const [audioFiles, setAudioFiles] = useState<ReportAudioFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadAudioFiles = useCallback(async () => {
      setIsLoading(true);
      try {
        const data = await fetchReportAudioFiles(userReportsId);
        setAudioFiles(data);
      } catch (error) {
        console.error('Error fetching audio files:', error);
      } finally {
        setIsLoading(false);
      }
    }, [userReportsId]);

    useEffect(() => {
      if (isExpanded) {
        loadAudioFiles();
      }
    }, [isExpanded, loadAudioFiles]);

    const handleToggleIsUsed = async (
      audioFileId: string,
      currentIsUsed: boolean,
    ) => {
      try {
        await updateAudioFileIsUsed(audioFileId, !currentIsUsed);
        setAudioFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.audio_file_id === audioFileId
              ? { ...file, is_used: !currentIsUsed }
              : file,
          ),
        );
      } catch (error) {
        console.error('Error updating is_used:', error);
      }
    };
    const handleEditAudioFile = (audioFileId: string) => {
      if (typeof window !== 'undefined') {
        window.open(`/reports-stt-edit?audioFilesId=${audioFileId}`);
      }
    };

    return (
      <Collapse in={isExpanded} animateOpacity>
        <Box
          border='1px solid #EAECF0'
          borderRadius='8px'
          p={4}
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
                    <Th>STT</Th>
                    <Th>마지막 편집일시</Th>
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
                              handleToggleIsUsed(
                                file.audio_file_id,
                                file.is_used,
                              )
                            }
                            colorScheme='teal'
                          />
                        </HStack>
                      </Td>
                      <Td>
                        <Box position='relative' display='inline-block'>
                          <Button
                            onClick={() =>
                              handleEditAudioFile(file.audio_file_id)
                            }
                          >
                            편집
                          </Button>
                          {!file.is_edited && (
                            <Box
                              position='absolute'
                              top='-5px'
                              left='-5px'
                              width='7px'
                              height='7px'
                              borderRadius='full'
                              backgroundColor='red.500'
                            />
                          )}
                        </Box>
                      </Td>
                      <Td>{file.edited_at}</Td>
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
  },
);
export default ReportCollapse;
