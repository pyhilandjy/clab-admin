'use client';

import { useEffect, useState } from 'react';

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
} from '@chakra-ui/react';

import { fetchUserPlans, deleteUserPlan } from '@/api/user_plan';
import Layout from '@/components/Layout';
import { UserPlan } from '@/types/user_plans';

const UserPlansPage = () => {
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserPlans = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUserPlans();
      setUserPlans(data);
    } catch (error) {
      console.error('Error fetching user plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userPlansId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteUserPlan(userPlansId);
        setUserPlans((prev) =>
          prev.filter((plan) => plan.user_plans_id !== userPlansId),
        );
      } catch (error) {
        console.error(
          `Error deleting user plan with ID ${userPlansId}:`,
          error,
        );
      }
    }
  };

  useEffect(() => {
    loadUserPlans();
  }, []);

  return (
    <Layout>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        width='100%'
        maxWidth='2000px'
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
                <Th>사용자 이름</Th>
                <Th>플랜 이름</Th>
                <Th>플랜 생성일</Th>
                <Th>상태</Th>
                <Th>사용자 생성일</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={6} textAlign='center'>
                    Loading...
                  </Td>
                </Tr>
              ) : userPlans.length > 0 ? (
                userPlans.map((plan) => (
                  <Tr key={plan.user_plans_id}>
                    <Td>{plan.user_name}</Td>
                    <Td>{plan.plan_name}</Td>
                    <Td>{new Date(plan.plan_created_at).toLocaleString()}</Td>
                    <Td>{plan.status}</Td>
                    <Td>{new Date(plan.user_created_at).toLocaleString()}</Td>
                    <Td>
                      <Button
                        colorScheme='red'
                        onClick={() => handleDelete(plan.user_plans_id)}
                      >
                        삭제
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign='center'>
                    No data available
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default UserPlansPage;
