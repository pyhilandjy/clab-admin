import { useEffect, useState } from 'react';
import { Container } from '@chakra-ui/react';

import { createSpeechAct, updateSpeechAct } from '@/api/user_report';
import { SpeechActData } from '@/types/user_reports';

import InsightInput from './components/insight-input';
import SpeechActTable from './components/speech-act-data';

interface SpeechActProps {
  userReportsId: string;
}

export default function SpeechAct({ userReportsId }: SpeechActProps) {
  const [speechActData, setSpeechActData] = useState<SpeechActData | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await createSpeechAct(userReportsId);
        if (data && Array.isArray(data.data)) {
          setSpeechActData(data);
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
      {Array.isArray(speechActData?.data) &&
        speechActData.data.map((speakerData, index) => (
          <SpeechActTable key={index} speakerData={speakerData} />
        ))}

      <InsightInput
        insight={speechActData?.insights || ''}
        onUpdate={(newInsight) => {
          if (speechActData) {
            setSpeechActData({ ...speechActData, insights: newInsight });
          }
        }}
        onSave={async () => {
          if (speechActData) {
            await updateSpeechAct(userReportsId, speechActData);
            alert('저장되었습니다.');
          }
        }}
      />
    </Container>
  );
}
