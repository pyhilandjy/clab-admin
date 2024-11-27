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
} from '@chakra-ui/react';

import {
  fetchReports,
  fetchReportAudioFiles,
  updateAudioFileIsUsed,
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

  const toggleRow = async (reportId: string) => {
    if (expandedRow === reportId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(reportId);
      if (!audioFiles[reportId]) {
        try {
          const data = await fetchReportAudioFiles(reportId);
          setAudioFiles((prev) => ({ ...prev, [reportId]: data }));
        } catch (error) {
          console.error('Error fetching audio files:', error);
        }
      }
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
        width='1064px'
        mt={20}
        ml={20}
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
                <Th>아이이름</Th>
                <Th>레포트명</Th>
                <Th>발송예정일시</Th>
                <Th>검수</Th>
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
                      <Td>{report.child_name}</Td>
                      <Td>
                        <Box>
                          <Text>{report.report_title}</Text>
                          <Text fontSize='sm' color='gray.500'>
                            {report.plans_name}
                          </Text>
                        </Box>
                      </Td>
                      <Td>{report.send_at}</Td>
                      <Td>{report.status}</Td>
                      <Td>{report.inspection}</Td>
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
                                              onChange={async () => {
                                                try {
                                                  await updateAudioFileIsUsed(
                                                    file.audio_file_id,
                                                    !file.is_used,
                                                  );
                                                  setAudioFiles((prev) => ({
                                                    ...prev,
                                                    [report.user_reports_id]:
                                                      prev[
                                                        report.user_reports_id
                                                      ].map((f) =>
                                                        f.audio_file_id ===
                                                        file.audio_file_id
                                                          ? {
                                                              ...f,
                                                              is_used:
                                                                !file.is_used,
                                                            }
                                                          : f,
                                                      ),
                                                  }));
                                                } catch (error) {
                                                  console.error(
                                                    'Error updating is_used:',
                                                    error,
                                                  );
                                                }
                                              }}
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
                                                  `/stt-edit?audioFilesId=${file.audio_file_id}&userId=${report.user_id}`,
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
        <HStack
          justify='space-between'
          align='center'
          width='1064px'
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
