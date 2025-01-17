'use client';

import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Textarea,
  VStack,
  HStack,
  Text,
  Input,
} from '@chakra-ui/react';

import { fetchInsightData, upsertInsightData } from '@/api/user_report';
import { InsightData } from '@/types/user_reports';

interface InsightProps {
  userReportsId: string;
}

const Insight: React.FC<InsightProps> = ({ userReportsId }) => {
  const [insightBlocks, setInsightBlocks] = useState<InsightData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInsightData(userReportsId);

        // reports_order에 따라 정렬
        data.sort((a, b) => a.reports_order - b.reports_order);

        // null 값을 빈 문자열로 변환
        data.forEach((block) => {
          block.insight = block.insight || '';
          block.example = block.example || '';
          block.title = block.title || '';
        });

        // 빈 블록을 적절한 위치에 삽입
        if (data.length < 2) {
          if (!data.find((block) => block.reports_order === 1)) {
            data.unshift({
              id: '',
              created_at: '',
              user_reports_id: userReportsId,
              reports_order: 1,
              title: '',
              insight: '',
              example: '',
              text: [''],
            });
          }
          if (!data.find((block) => block.reports_order === 2)) {
            data.push({
              id: '',
              created_at: '',
              user_reports_id: userReportsId,
              reports_order: 2,
              title: '',
              insight: '',
              example: '',
              text: [''],
            });
          }
        }

        setInsightBlocks(data.slice(0, 2));
      } catch (error) {
        console.error('Error fetching insight data:', error);
        setInsightBlocks([
          {
            id: '',
            created_at: '',
            user_reports_id: userReportsId,
            reports_order: 1,
            title: '',
            insight: '',
            example: '',
            text: [''],
          },
          {
            id: '',
            created_at: '',
            user_reports_id: userReportsId,
            reports_order: 2,
            title: '',
            insight: '',
            example: '',
            text: [''],
          },
        ]);
      }
    };

    fetchData();
  }, [userReportsId]);

  const handleConversationChange = (
    blockIndex: number,
    conversationIndex: number,
    value: string,
  ) => {
    const updatedBlocks = [...insightBlocks];
    updatedBlocks[blockIndex].text[conversationIndex] = value;
    setInsightBlocks(updatedBlocks);
  };

  const handleAddConversation = (blockIndex: number) => {
    const updatedBlocks = [...insightBlocks];
    if (!updatedBlocks[blockIndex].text) {
      updatedBlocks[blockIndex].text = [];
    }
    updatedBlocks[blockIndex].text.push('');
    setInsightBlocks(updatedBlocks);
  };

  const handleRemoveConversation = (
    blockIndex: number,
    conversationIndex: number,
  ) => {
    const updatedBlocks = [...insightBlocks];
    updatedBlocks[blockIndex].text = updatedBlocks[blockIndex].text.filter(
      (_, i) => i !== conversationIndex,
    );
    setInsightBlocks(updatedBlocks);
  };

  const handleFieldChange = (
    blockIndex: number,
    field: 'title' | 'insight' | 'example',
    value: string,
  ) => {
    const sanitizedValue = value || '';
    const updatedBlocks = [...insightBlocks];
    updatedBlocks[blockIndex][field] = sanitizedValue;
    setInsightBlocks(updatedBlocks);
  };

  const handleSave = async (blockIndex: number) => {
    const blockToSave = {
      ...insightBlocks[blockIndex],
      user_reports_id: userReportsId,
      insight: insightBlocks[blockIndex].insight || '',
      example: insightBlocks[blockIndex].example || '',
      title: insightBlocks[blockIndex].title || '',
    };

    try {
      const response = await upsertInsightData(blockToSave);
      console.log(`Insight Block ${blockIndex + 1} saved:`, response.message);
    } catch (error) {
      console.error(`Error saving Insight Block ${blockIndex + 1}:`, error);
    }
  };

  return (
    <Box p={5} maxW='800px' m='0 auto' bg='white'>
      <VStack spacing={6} align='stretch'>
        {insightBlocks.map((block, blockIndex) => (
          <Box
            key={blockIndex}
            p={4}
            border='1px solid #ddd'
            borderRadius='8px'
            boxShadow='sm'
            bg='gray.50'
          >
            <HStack justifyContent='space-between' mb={4}>
              <Text fontSize='lg'>인사이트 {blockIndex + 1}</Text>
              <Button
                size='sm'
                colorScheme='blue'
                onClick={() => handleSave(blockIndex)}
              >
                저장
              </Button>
            </HStack>

            {/* 대화 Section */}
            <Box mb={4}>
              <HStack justifyContent='space-between' mb={2}>
                <Text>대화</Text>
                <Button
                  size='sm'
                  colorScheme='teal'
                  onClick={() => handleAddConversation(blockIndex)}
                >
                  + 추가
                </Button>
              </HStack>
              {block.text && block.text.length > 0 ? (
                block.text.map((value, conversationIndex) => (
                  <HStack key={conversationIndex} spacing={2} mb={2}>
                    <Input
                      placeholder={`대화 입력 ${conversationIndex + 1}`}
                      value={value}
                      onChange={(e) =>
                        handleConversationChange(
                          blockIndex,
                          conversationIndex,
                          e.target.value,
                        )
                      }
                      size='sm'
                    />
                    <Box
                      as='button'
                      onClick={() =>
                        handleRemoveConversation(blockIndex, conversationIndex)
                      }
                      fontSize='lg'
                      color='red.500'
                      title='삭제'
                    >
                      X
                    </Box>
                  </HStack>
                ))
              ) : (
                <Text>대화가 없습니다.</Text>
              )}
            </Box>

            {/* 타이틀 Section */}
            <Box mb={4}>
              <HStack align='center'>
                <Text width='80px'>타이틀</Text>
                <Input
                  placeholder='타이틀 입력'
                  value={block.title}
                  onChange={(e) =>
                    handleFieldChange(blockIndex, 'title', e.target.value)
                  }
                  size='sm'
                />
              </HStack>
            </Box>

            {/* 인사이트 Section */}
            <Box mb={4}>
              <HStack align='center'>
                <Text width='80px'>인사이트</Text>
                <Textarea
                  placeholder='인사이트 작성'
                  value={block.insight}
                  onChange={(e) =>
                    handleFieldChange(blockIndex, 'insight', e.target.value)
                  }
                  size='sm'
                />
              </HStack>
            </Box>

            {/* 예시 Section */}
            <Box>
              <HStack align='center'>
                <Text width='80px'>예시</Text>
                <Textarea
                  placeholder='예시 작성'
                  value={block.example}
                  onChange={(e) =>
                    handleFieldChange(blockIndex, 'example', e.target.value)
                  }
                  size='sm'
                />
              </HStack>
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Insight;
