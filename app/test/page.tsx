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

import { fetchInsightData } from '@/api/user_report';
import { InsightData } from '@/types/user_reports';

const InsightForm: React.FC = () => {
  const [insightBlocks, setInsightBlocks] = useState<InsightData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchInsightData(
          'a5f1071e-ad9a-46c4-a697-a6bf8c36f96e',
        );
        while (data.length < 2) {
          data.push({
            id: '',
            created_at: '',
            user_reports_id: '',
            reports_order: data.length + 1,
            title: '',
            insight: '',
            example: '',
            text: [''],
          });
        }
        setInsightBlocks(data.slice(0, 2));
      } catch (error) {
        console.error('Error fetching insight data:', error);
        setInsightBlocks([
          {
            id: '',
            created_at: '',
            user_reports_id: '',
            reports_order: 1,
            title: '',
            insight: '',
            example: '',
            text: [''],
          },
          {
            id: '',
            created_at: '',
            user_reports_id: '',
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
  }, []);

  // Update conversation inputs
  const handleConversationChange = (
    blockIndex: number,
    conversationIndex: number,
    value: string,
  ) => {
    const updatedBlocks = [...insightBlocks];
    updatedBlocks[blockIndex].text[conversationIndex] = value;
    setInsightBlocks(updatedBlocks);
  };

  // Add a new conversation field
  const handleAddConversation = (blockIndex: number) => {
    const updatedBlocks = [...insightBlocks];
    if (!updatedBlocks[blockIndex].text) {
      updatedBlocks[blockIndex].text = [];
    }
    updatedBlocks[blockIndex].text.push('');
    setInsightBlocks(updatedBlocks);
  };

  // Remove a conversation field
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

  // Update title, insight, or example
  const handleFieldChange = (
    blockIndex: number,
    field: 'title' | 'insight' | 'example',
    value: string,
  ) => {
    const updatedBlocks = [...insightBlocks];
    updatedBlocks[blockIndex][field] = value;
    setInsightBlocks(updatedBlocks);
  };

  // Save button click handler
  const handleSave = (blockIndex: number) => {
    console.log(`Insight Block ${blockIndex + 1}:`, insightBlocks[blockIndex]);
  };

  return (
    <Box
      p={5}
      border='1px solid #ccc'
      borderRadius='8px'
      maxW='800px'
      m='0 auto'
      bg='white'
    >
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
              <Text fontWeight='bold' fontSize='lg'>
                인사이트 {blockIndex + 1}
              </Text>
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
                <Text fontWeight='bold'>대화</Text>
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
                <Text fontWeight='bold' width='80px'>
                  타이틀
                </Text>
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
                <Text fontWeight='bold' width='80px'>
                  인사이트
                </Text>
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
                <Text fontWeight='bold' width='80px'>
                  예시
                </Text>
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

export default InsightForm;
