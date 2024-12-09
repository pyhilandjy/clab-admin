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
  Box,
  Button,
  Text,
  Collapse,
  HStack,
  Switch,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react';

import {
  fetchReports,
  fetchReportAudioFiles,
  updateAudioFileIsUsed,
  updateUserReportsInspection,
  updateUserReportsInspector,
} from '@/api/report-management';
import Layout from '@/components/Layout';
import { Report, ReportAudioFile } from '@/types/report-management';

const ReportsManagement = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [audioFiles, setAudioFiles] = useState<
    Record<string, ReportAudioFile[]>
  >({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspector, setInspector] = useState('');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const pageSize = 20;

  const loadReports = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const { reports, total_pages } = await fetchReports(
        currentPage,
        pageSize,
      );
      setReports(reports);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRow = async (userReportsId: string) => {
    if (expandedRow === userReportsId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(userReportsId);
      if (!audioFiles[userReportsId]) {
        try {
          const data = await fetchReportAudioFiles(userReportsId);
          setAudioFiles((prev) => ({ ...prev, [userReportsId]: data }));
        } catch (error) {
          console.error('Error fetching audio files:', error);
        }
      }
    }
  };

  const handleOnChangeInspection = async (
    userReportsId: string,
    newInspection: string,
  ) => {
    if (newInspection === 'completed') {
      setCurrentReportId(userReportsId);
      setIsModalOpen(true);
    } else {
      try {
        await updateUserReportsInspection(userReportsId, newInspection);
        await updateUserReportsInspector(userReportsId, inspector);
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.user_reports_id === userReportsId
              ? {
                  ...report,
                  inspection: newInspection,
                  inspector: '',
                  inspected_at: '',
                }
              : report,
          ),
        );
      } catch (error) {
        console.error('Error updating inspection:', error);
      }
    }
  };

  const formatDateManually = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleSaveInspector = async () => {
    if (currentReportId && inspector.trim()) {
      try {
        await updateUserReportsInspector(currentReportId, inspector);
        await updateUserReportsInspection(currentReportId, 'completed');

        setReports((prevReports) =>
          prevReports.map((report) =>
            report.user_reports_id === currentReportId
              ? {
                  ...report,
                  inspection: 'completed',
                  inspector: inspector,
                  inspected_at: formatDateManually(new Date()),
                }
              : report,
          ),
        );
        setIsModalOpen(false);
        setInspector('');
      } catch (error) {
        console.error('Error saving inspector:', error);
      }
    } else {
      alert('검수자를 입력하세요');
    }
  };

  const handleIsUsedChange = async (
    audioFileId: string,
    currentIsUsed: boolean,
    userReportsId: string,
  ) => {
    try {
      await updateAudioFileIsUsed(audioFileId, !currentIsUsed);

      setAudioFiles((prev) => ({
        ...prev,
        [userReportsId]: prev[userReportsId].map((file) =>
          file.audio_file_id === audioFileId
            ? { ...file, is_used: !currentIsUsed }
            : file,
        ),
      }));
    } catch (error) {
      console.error('Error updating is_used:', error);
    }
  };

  useEffect(() => {
    loadReports(page);
  }, [page]);

  return (
    <Layout>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        width='100%'
        maxWidth='1200px'
        margin='0 auto'
        marginTop='100px'
        px={4}
      >
        <TableContainer
          width='100%'
          border='1px solid #EAECF0'
          borderRadius='8px 8px 0px 0px'
        >
          <Table>
            <Thead>
              <Tr backgroundColor='#E9E9E9'>
                <Th>고객이름</Th>
                <Th>레포트명</Th>
                <Th>발송예정일시</Th>
                <Th>검수</Th>
                <Th>검수자</Th>
                <Th>발송상태</Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={7} textAlign='center'>
                    Loading...
                  </Td>
                </Tr>
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <React.Fragment key={report.user_reports_id}>
                    <Tr>
                      <Td>{report.user_name}</Td>
                      <Td>
                        <Box>
                          <Text>{report.report_title}</Text>
                          <Text fontSize='sm' color='gray.500'>
                            {report.plans_name}
                          </Text>
                        </Box>
                      </Td>
                      {/* send_at 포멧한 값을 보여주는 것으로 변경 state는 유지 보여지는 값만 */}
                      {/* datetimepicker 사용 추가 */}
                      <Td>{report.send_at}</Td>

                      <Td>
                        <Select
                          value={report.inspection}
                          onChange={(e) =>
                            handleOnChangeInspection(
                              report.user_reports_id,
                              e.target.value,
                            )
                          }
                          backgroundColor='white'
                          minWidth='100px'
                        >
                          <option value='editing'>편집중</option>
                          <option value='completed'>완료</option>
                        </Select>
                      </Td>
                      <Td>
                        {' '}
                        <Box>
                          <Text>{report.inspector}</Text>
                          <Text fontSize='sm' color='gray.500'>
                            {report.inspected_at}
                          </Text>
                        </Box>
                      </Td>
                      <Td>{report.status}</Td>
                      <Td>
                        <Button
                          onClick={() => toggleRow(report.user_reports_id)}
                        >
                          {expandedRow === report.user_reports_id
                            ? '녹음수정'
                            : '녹음수정'}
                        </Button>
                      </Td>
                      <Td>
                        <Button>내용편집</Button>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={10} padding='0'>
                        <Collapse
                          in={expandedRow === report.user_reports_id}
                          animateOpacity
                        >
                          <Box
                            border='1px solid #EAECF0'
                            borderRadius='8px'
                            p={4}
                            backgroundColor='#F9FAFB'
                          >
                            {audioFiles[report.user_reports_id] ? (
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
                                  {audioFiles[report.user_reports_id].map(
                                    (file) => (
                                      <Tr key={file.audio_file_id}>
                                        <Td>
                                          {new Date(
                                            file.record_date,
                                          ).toLocaleString()}
                                        </Td>
                                        <Td>{file.record_time}</Td>
                                        <Td>{file.mission_title}</Td>
                                        <Td>
                                          <HStack align='center'>
                                            <Text>
                                              {file.is_used
                                                ? '활성화'
                                                : '비활성화'}
                                            </Text>
                                            <Switch
                                              size='md'
                                              isChecked={file.is_used}
                                              colorScheme='teal'
                                              onChange={() =>
                                                handleIsUsedChange(
                                                  file.audio_file_id,
                                                  file.is_used,
                                                  report.user_reports_id,
                                                )
                                              }
                                            />
                                          </HStack>
                                        </Td>
                                        <Td>
                                          <Box
                                            position='relative'
                                            display='inline-block'
                                          >
                                            <Button
                                              onClick={() =>
                                                window.open(
                                                  `/reports-stt-edit?audioFilesId=${file.audio_file_id}`,
                                                )
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
                                    ),
                                  )}
                                </Tbody>
                              </Table>
                            ) : (
                              <Text>Loading audio files...</Text>
                            )}
                          </Box>
                        </Collapse>
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td colSpan={7} textAlign='center'>
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>검수자 이름 입력</ModalHeader>
            <ModalBody>
              <Input
                placeholder='검수자 이름'
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleSaveInspector}>
                저장
              </Button>
              <Button variant='ghost' onClick={() => setIsModalOpen(false)}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <HStack
          width='100%'
          justify='space-between'
          align='center'
          padding='12px 24px 16px 24px'
          backgroundColor='#E9E9E9'
          borderRadius='0px 0px 8px 8px'
          border='1px solid #EAECF0'
        >
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={page === 1}
            backgroundColor='white'
          >
            Previous
          </Button>
          <Box>
            Page {page} of {totalPages}
          </Box>
          <Button
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            isDisabled={page === totalPages}
            backgroundColor='white'
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Layout>
  );
};

export default ReportsManagement;
