'use client';

import React, { useState, useEffect, useRef } from 'react';

import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  Spinner,
  Grid,
  GridItem,
  Collapse,
} from '@chakra-ui/react';
import WordCloud from 'wordcloud';

import { fetchWordCloudData } from '@/api/user_report';
import { WordcloudData } from '@/types/user_reports';

interface Word {
  text: string;
  value: number;
}

interface WordCloudCanvasProps {
  words: Word[];
  width?: number;
  height?: number;
}

const WordCloudCanvas: React.FC<WordCloudCanvasProps> = ({
  words,
  width = 300,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && words.length > 0) {
      const list: [string, number][] = words.map((w): [string, number] => [
        w.text,
        w.value,
      ]);
      WordCloud(canvasRef.current, {
        list: list,
        shape: 'circle',
        backgroundColor: '#fff',
        weightFactor: (size) => Math.log2(size) * 10,
        color: () => '#' + Math.floor(Math.random() * 16777215).toString(16),
        rotateRatio: 0,
      });
    }
  }, [words]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

interface WordCloudComponentProps {
  userReportsId: string;
}

const WordCloudComponent: React.FC<WordCloudComponentProps> = ({
  userReportsId,
}) => {
  const [wordCloud, setWordCloud] = useState<WordcloudData>({
    data: [],
    insights: '',
  });
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editCacheRef = useRef<Record<string, Record<string, string | number>>>(
    {},
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!userReportsId) {
        setError('No user_reports_id provided');
        return;
      }

      setIsLoading(true);
      try {
        const fetched = await fetchWordCloudData(userReportsId);
        setWordCloud(fetched);
        setInsight(fetched.insights);
      } catch (error) {
        setError('Failed to fetch data');
        console.error('Error fetching word cloud data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userReportsId]);

  const handleWordChange = (
    speaker: string,
    oldWord: string,
    newWord: string,
  ) => {
    if (!editCacheRef.current[speaker]) {
      editCacheRef.current[speaker] = {};
    }
    editCacheRef.current[speaker][oldWord] = newWord;
  };

  const handleValueChange = (speaker: string, word: string, value: number) => {
    if (!editCacheRef.current[speaker]) {
      editCacheRef.current[speaker] = {};
    }
    editCacheRef.current[speaker][`${word}-value`] = value;
  };

  const handleSaveChanges = () => {
    const updatedData = wordCloud.data.map((item) => {
      const speakerEdits = editCacheRef.current[item.speaker] || {};
      const updatedWordCounts = Object.entries(item.word_counts).reduce(
        (acc, [key, value]) => {
          const newKey = speakerEdits[key] ?? key;
          const newValue = Number(speakerEdits[`${key}-value`] ?? value);
          acc[newKey] = newValue;
          return acc;
        },
        {} as Record<string, number>,
      );
      console.log('Updated word counts:', updatedWordCounts);

      return {
        ...item,
        word_counts: updatedWordCounts,
      };
    });

    const finalResult: WordcloudData = {
      data: updatedData,
      insights: insight,
    };

    setWordCloud(finalResult);
    console.log('Updated data:', finalResult);
    editCacheRef.current = {};
    alert('수정이 저장되었습니다.');
  };

  const handleEditButtonClick = () => {
    setIsExpanded((prev) => !prev);
  };
  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color='red.500'>{error}</Text>;
  }

  if (!wordCloud.data || wordCloud.data.length === 0) {
    return <Text>데이터가 없습니다. Word Cloud를 생성해주세요.</Text>;
  }

  const speakerWordClouds = wordCloud.data.map((speakerData) => {
    const wordEntries = speakerData.word_counts
      ? Object.entries(speakerData.word_counts)
      : [];
    const words = wordEntries.map(([text, value]) => ({ text, value }));
    return { speaker: speakerData.speaker, words };
  });

  return (
    <Box padding={4}>
      {/* 워드클라우드 표시 */}
      <Grid templateColumns='repeat(2, 1fr)' gap={4} marginBottom={4}>
        {/* 좌측 워드클라우드 */}
        <GridItem colSpan={1}>
          {speakerWordClouds[0] && (
            <Box borderWidth='1px' borderRadius='md' padding={4} height='100%'>
              <Text fontWeight='bold' fontSize='lg' marginBottom={2}>
                {speakerWordClouds[0].speaker}
              </Text>
              <Divider my={2} />
              {speakerWordClouds[0].words.length > 0 ? (
                <WordCloudCanvas words={speakerWordClouds[0].words} />
              ) : (
                <Text>단어 데이터가 없습니다.</Text>
              )}
            </Box>
          )}
        </GridItem>
        {/* 우측 워드클라우드 */}
        <GridItem colSpan={1}>
          {speakerWordClouds[1] && (
            <Box borderWidth='1px' borderRadius='md' padding={4} height='100%'>
              <Text fontWeight='bold' fontSize='lg' marginBottom={2}>
                {speakerWordClouds[1].speaker}
              </Text>
              <Divider my={2} />
              {speakerWordClouds[1].words.length > 0 ? (
                <WordCloudCanvas words={speakerWordClouds[1].words} />
              ) : (
                <Text>단어 데이터가 없습니다.</Text>
              )}
            </Box>
          )}
        </GridItem>
      </Grid>

      {/* Insight 라벨 및 입력박스 */}
      <Text fontWeight='bold' fontSize='md' marginBottom={2}>
        Insight
      </Text>
      <HStack marginBottom={4}>
        <Input
          placeholder='Enter your insight'
          defaultValue={insight}
          // onChange={(e) => setInsight(e.target.value)}
          flex='1'
          height='150px'
        />
        <Button colorScheme='blue' onClick={handleSaveChanges}>
          Save
        </Button>
      </HStack>
      {/* 에디터 표시/숨김 버튼 */}
      <Button
        colorScheme='blue'
        onClick={handleEditButtonClick}
        marginBottom={4}
        width='100%'
      >
        {isExpanded ? 'Hide Editor' : 'Show Editor'}
      </Button>

      <Collapse in={isExpanded} animateOpacity>
        <Grid templateColumns='repeat(2, 1fr)' gap={4} marginTop={4}>
          {/* 첫 번째 데이터 편집 UI */}
          <GridItem colSpan={1}>
            {wordCloud.data[0] && (
              <Box
                key={wordCloud.data[0].speaker}
                borderWidth='1px'
                borderRadius='md'
                padding={4}
                marginBottom={4}
              >
                <Text fontWeight='bold' fontSize='lg' marginBottom={2}>
                  Speaker: {wordCloud.data[0].speaker}
                </Text>
                <Divider my={2} />
                <VStack align='start' spacing={2}>
                  {Object.entries(wordCloud.data[0].word_counts).map(
                    ([word, count]) => (
                      <HStack
                        key={word}
                        spacing={5}
                        justifyContent='space-between'
                        width='100%'
                      >
                        <Input
                          defaultValue={word}
                          onChange={(e) =>
                            handleWordChange(
                              wordCloud.data[0].speaker,
                              word,
                              e.target.value,
                            )
                          }
                          width='100px'
                          height='30px'
                          placeholder='Word'
                          fontSize='14px'
                        />
                        <Input
                          type='number'
                          defaultValue={count}
                          onChange={(e) =>
                            handleValueChange(
                              wordCloud.data[0].speaker,
                              word,
                              parseInt(e.target.value, 10) || 0,
                            )
                          }
                          width='60px'
                          height='30px'
                          textAlign='center'
                          fontSize='14px'
                        />
                      </HStack>
                    ),
                  )}
                </VStack>
              </Box>
            )}
          </GridItem>

          {/* 두 번째 데이터 편집 UI */}
          <GridItem colSpan={1}>
            {wordCloud.data[1] && (
              <Box
                key={wordCloud.data[1].speaker}
                borderWidth='1px'
                borderRadius='md'
                padding={4}
                marginBottom={4}
              >
                <Text fontWeight='bold' fontSize='lg' marginBottom={2}>
                  Speaker: {wordCloud.data[1].speaker}
                </Text>
                <Divider my={2} />
                <VStack align='start' spacing={2}>
                  {Object.entries(wordCloud.data[1].word_counts).map(
                    ([word, count]) => (
                      <HStack
                        key={word}
                        spacing={5}
                        justifyContent='space-between'
                        width='100%'
                      >
                        <Input
                          defaultValue={word}
                          onChange={(e) =>
                            handleWordChange(
                              wordCloud.data[1].speaker,
                              word,
                              e.target.value,
                            )
                          }
                          width='100px'
                          height='30px'
                          placeholder='Word'
                          fontSize='14px'
                        />
                        <Input
                          type='number'
                          defaultValue={count}
                          onChange={(e) =>
                            handleValueChange(
                              wordCloud.data[1].speaker,
                              word,
                              parseInt(e.target.value, 10) || 0,
                            )
                          }
                          width='60px'
                          height='30px'
                          textAlign='center'
                          fontSize='14px'
                        />
                      </HStack>
                    ),
                  )}
                </VStack>
              </Box>
            )}
          </GridItem>
        </Grid>
      </Collapse>

      <Button
        colorScheme='blue'
        onClick={handleSaveChanges}
        marginTop={4}
        width='100%'
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default WordCloudComponent;
