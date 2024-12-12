'use client';

import React, { useEffect, useState } from 'react';

import {
  Box,
  Table,
  Text,
  Spinner,
  Center,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';

import { fetchUserReportsInfo } from '@/api/user_report';
import { UserReportsInfo } from '@/types/user_reports';

interface ReportInfoProps {
  userReportsId: string;
}

const ReportInfo: React.FC<ReportInfoProps> = ({ userReportsId }) => {
  const [info, setInfo] = useState<UserReportsInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!userReportsId) {
        setError('No user_reports_id provided');
        return;
      }
      setIsLoading(true);
      try {
        const data: UserReportsInfo = await fetchUserReportsInfo(userReportsId);
        console.log(data);
        setInfo(data);
      } catch (err: any) {
        console.error('Error fetching user reports info:', err);
        setError('Failed to load user reports info');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userReportsId]);

  if (isLoading) {
    return (
      <Center height='200px'>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height='200px'>
        <Text color='red.500'>{error}</Text>
      </Center>
    );
  }

  if (!info) {
    return (
      <Center height='200px'>
        <Text>데이터가 없습니다.</Text>
      </Center>
    );
  }
  console.log(info.title);

  return (
    <Box>
      <Table variant='simple'>
        <Tbody>
          <Tr>
            <Td>레포트 이름: {info.title}</Td>
            <Td>플랜명: {info.plan_name}</Td>
          </Tr>
          <Tr>
            <Td>고객이름: {info.user_name}</Td>
            <Td>아이이름: {info.first_name}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ReportInfo;
