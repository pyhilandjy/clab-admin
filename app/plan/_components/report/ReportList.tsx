'use client';

import React, { useState } from 'react';

import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Collapse,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { deleteReport } from '@/api/report';
import { ReportWithMissions, ReportListProps } from '@/types/report';

import AddReportPage from './AddReportPage';
import EditReportPage from './EditReportPage';

const ReportList: React.FC<ReportListProps> = ({
  reports,
  isOpen,
  onDeleteSuccess,
  onAddReport,
  missions,
  planId,
}) => {
  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();
  const [selectedReport, setSelectedReport] =
    useState<ReportWithMissions | null>(null);
  const toast = useToast();

  const handleReportSave = async () => {
    await onAddReport();
    onAddModalClose();
  };

  const handleEditReport = (report: ReportWithMissions) => {
    setSelectedReport(report);
    onEditModalOpen();
  };

  const handleReportUpdate = async () => {
    await onAddReport();
    onEditModalClose();
  };

  const handleDeleteReport = async (id: string) => {
    const confirmDelete = confirm('정말로 이 리포트를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteReport(id);
      onDeleteSuccess(id);
      toast({
        title: '리포트가 성공적으로 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: '리포트 삭제 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          width='70vw'
          maxWidth='1200px'
          bg='gray.50'
          borderRadius='md'
          border='1px solid'
          borderColor='gray.200'
        >
          <HStack justifyContent='space-between' mb={4}>
            <Button colorScheme='blue' onClick={onAddModalOpen}>
              리포트 추가
            </Button>
          </HStack>
          <Table size='sm' variant='simple'>
            <Thead>
              <Tr>
                <Th>리포트명</Th>
                <Th>양적 분석</Th>
                <Th>질적 분석</Th>
                <Th>연결된 미션</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports.map((reportWithMissions) => (
                <Tr key={reportWithMissions.report.id}>
                  <Td>{reportWithMissions.report.title}</Td>
                  <Td>
                    {[
                      reportWithMissions.report.wordcloud && '워드클라우드',
                      reportWithMissions.report.sentence_length && '문장길이',
                      reportWithMissions.report.pos_ratio && '품사비율',
                      reportWithMissions.report.speech_act && '문장분류',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </Td>
                  <Td>{reportWithMissions.report.insight ? '인사이트' : ''}</Td>
                  <Td>
                    {reportWithMissions.missions
                      ?.map((mission) => mission.title)
                      .join(', ') || '연결된 미션 없음'}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        size='sm'
                        colorScheme='blue'
                        aria-label='리포트 수정'
                        icon={<EditIcon />}
                        onClick={() => handleEditReport(reportWithMissions)}
                      />
                      <IconButton
                        size='sm'
                        colorScheme='red'
                        aria-label='리포트 삭제'
                        icon={<DeleteIcon />}
                        onClick={() =>
                          handleDeleteReport(reportWithMissions.report.id)
                        }
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Collapse>

      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size='5xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>리포트 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddReportPage
              planId={planId}
              missions={missions}
              onClose={onAddModalClose}
              onSave={handleReportSave}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {selectedReport && (
        <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size='5xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>리포트 수정</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EditReportPage
                reportWithMissions={selectedReport}
                missions={missions}
                onClose={onEditModalClose}
                onSave={handleReportUpdate}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ReportList;
