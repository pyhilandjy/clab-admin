'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';

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
  HStack,
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
  updateUserReportsInspection,
  updateUserReportsInspector,
} from '@/api/report-management';
import Layout from '@/components/Layout';
import { Report } from '@/types/report-management';

import ReportCollapse from './ReportCollapse';

const ReportsManagement = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const initialPage = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspector, setInspector] = useState('');
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const pageSize = 10;
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [inspectionFilter, setInspectionFilter] = useState<string | ''>(
    searchParams.get('inspection') || '',
  );
  const [statusFilter, setStatusFilter] = useState<string | ''>(
    searchParams.get('status') || '',
  );

  const loadReports = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        if (inspectionFilter) params.set('inspection', inspectionFilter);
        if (statusFilter) params.set('status', statusFilter);
        const { reports, total_pages } = await fetchReports(
          page,
          pageSize,
          inspectionFilter,
          statusFilter,
        );
        setReports(reports);
        setTotalPages(total_pages);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, inspectionFilter, statusFilter],
  );

  useEffect(() => {
    const pageFromQuery = Number(searchParams.get('page')) || 1;
    const userReportsIdFromQuery = searchParams.get('user_reports_id');

    setCurrentPage(pageFromQuery);
    setExpandedRow(userReportsIdFromQuery);
  }, [searchParams]);

  useEffect(() => {
    loadReports(currentPage);
  }, [currentPage, inspectionFilter, statusFilter, loadReports]);

  const handlePageChange = async (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.delete('user_reports_id');
    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(newPage);
  };

  const toggleRow = (userReportsId: string) => {
    setExpandedRow((prev) => (prev === userReportsId ? null : userReportsId));

    const params = new URLSearchParams(searchParams.toString());

    if (expandedRow === userReportsId) {
      params.delete('user_reports_id');
    } else {
      params.set('user_reports_id', userReportsId);
    }
    params.set('page', currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleOnChangeInspection = async (
    userReportsId: string,
    newInspection: string,
  ) => {
    if (newInspection === 'COMPLETED') {
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
        await updateUserReportsInspection(currentReportId, 'COMPLETED');

        setReports((prevReports) =>
          prevReports.map((report) =>
            report.user_reports_id === currentReportId
              ? {
                  ...report,
                  inspection: 'COMPLETED',
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

  const handleFilterChange = (
    filterType: 'inspection' | 'status',
    value: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

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
        <Box width='100%' mb={4}>
          <Text fontSize='sm' color='gray.500' mb={2}>
            필터
          </Text>
          <HStack spacing={4}>
            <Box>
              <Text fontSize='xs' color='gray.500' mb={1}>
                검수 상태 필터
              </Text>
              <Select
                placeholder='검수 상태 필터'
                value={inspectionFilter || ''}
                onChange={(e) => {
                  setInspectionFilter(e.target.value || '');
                  handleFilterChange('inspection', e.target.value);
                }}
              >
                <option value='IN_PROGRESS'>편집중</option>
                <option value='COMPLETED'>완료</option>
              </Select>
            </Box>
            <Box>
              <Text fontSize='xs' color='gray.500' mb={1}>
                발송 상태 필터
              </Text>
              <Select
                placeholder='발송 상태 필터'
                value={statusFilter || ''}
                onChange={(e) => {
                  setStatusFilter(e.target.value || '');
                  handleFilterChange('status', e.target.value);
                }}
              >
                <option value='NOT_STARTED'>대기중</option>
                <option value='IN_PROGRESS'>진행중</option>
                <option value='COMPLETED'>완료</option>
              </Select>
            </Box>
          </HStack>
        </Box>
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
                <Th>녹음시간</Th>
                <Th>녹음갯수</Th>
                <Th>미션상태</Th>
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
                reports
                  .filter(
                    (report) =>
                      !inspectionFilter ||
                      report.inspection === inspectionFilter,
                  )
                  .filter(
                    (report) => !statusFilter || report.status === statusFilter,
                  )
                  .map((report) => (
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
                        <Td>{report.total_record_time}</Td>
                        <Td>{report.audio_file_count}개</Td>
                        <Td>{report.mission_progress}</Td>

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
                            <option value='IN_PROGRESS'>편집중</option>
                            <option value='COMPLETED'>완료</option>
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
                        <Td>
                          {(() => {
                            const statusMap: Record<
                              'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
                              string
                            > = {
                              NOT_STARTED: '대기중',
                              IN_PROGRESS: '진행중',
                              COMPLETED: '완료',
                            };

                            return (
                              statusMap[
                                report.status as
                                  | 'NOT_STARTED'
                                  | 'IN_PROGRESS'
                                  | 'COMPLETED'
                              ] || '알 수 없음'
                            );
                          })()}
                        </Td>
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
                          <Button
                            onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.open(
                                  `/report-manage/user-reports?user_reports_id=${report.user_reports_id}`,
                                );
                              }
                            }}
                          >
                            내용편집
                          </Button>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td colSpan={10} padding='0'>
                          <ReportCollapse
                            userReportsId={report.user_reports_id}
                            isExpanded={expandedRow === report.user_reports_id}
                          />
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
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            isDisabled={currentPage === 1}
            backgroundColor='white'
          >
            Previous
          </Button>
          <Box>
            Page {currentPage} of {totalPages}
          </Box>
          <Button
            onClick={() =>
              handlePageChange(
                currentPage < totalPages ? currentPage + 1 : totalPages,
              )
            }
            isDisabled={currentPage === totalPages}
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
