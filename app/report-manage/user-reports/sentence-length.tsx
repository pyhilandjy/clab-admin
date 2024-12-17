'use client';
import { useEffect, useState } from 'react';

import { Grid, GridItem, Container } from '@chakra-ui/react';

import { createSentenceLength, updateSentenceLength } from '@/api/user_report';
import { SentenceLengthData } from '@/types/user_reports';

import InsightInput from './components/insight-input';
import ViolinPlotCanvas from './components/violin-plot-canvas';
import ViolinPlotData from './components/violin-plot-data';

interface SentenceLengthProps {
  userReportsId: string;
}

export default function SentenceLength({ userReportsId }: SentenceLengthProps) {
  const [sentenceLengthData, setSentenceLength] =
    useState<SentenceLengthData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await createSentenceLength(userReportsId);
        if (data && Array.isArray(data.data)) {
          setSentenceLength(data);
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (error) {
        console.error('Failed to load sentence length data:', error);
        alert('데이터를 불러오는 데 실패했습니다.');
      }
    };

    loadData();
  }, [userReportsId]);

  return (
    <Container maxW='100%' px={4}>
      <Grid
        templateColumns={
          sentenceLengthData?.data && sentenceLengthData.data.length === 1
            ? '1fr'
            : 'repeat(2, 1fr)'
        }
        gap={6}
        width='100%'
        justifyContent='center'
        alignItems='center'
        marginBottom={8}
      >
        {Array.isArray(sentenceLengthData?.data) &&
          sentenceLengthData.data.map((speakerData, index) => (
            <GridItem key={index} width='100%'>
              <ViolinPlotCanvas speakerData={speakerData} />
            </GridItem>
          ))}
      </Grid>

      {Array.isArray(sentenceLengthData?.data) &&
        sentenceLengthData.data.map((speakerData, index) => (
          <ViolinPlotData key={index} speakerData={speakerData} />
        ))}

      <InsightInput
        insight={sentenceLengthData?.insights || ''}
        onUpdate={(newInsight) => {
          if (sentenceLengthData) {
            setSentenceLength({ ...sentenceLengthData, insights: newInsight });
          }
        }}
        onSave={async () => {
          if (sentenceLengthData) {
            await updateSentenceLength(userReportsId, sentenceLengthData);
            alert('저장되었습니다.');
          }
        }}
      />
    </Container>
  );
}
