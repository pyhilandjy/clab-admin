import { useEffect, useState } from 'react';
import { Container } from '@chakra-ui/react';

import { createPosRatio, updatePosratio } from '@/api/user_report';
import { PosRatioData } from '@/types/user_reports';

import InsightInput from './components/insight-input';
import PosRatioDatas from './components/pos-ratio-data';

interface PosRatioProps {
  userReportsId: string;
}

export default function PosRatio({ userReportsId }: PosRatioProps) {
  const [posRatioData, setPosratio] = useState<PosRatioData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await createPosRatio(userReportsId);
        if (data && Array.isArray(data.data)) {
          setPosratio(data);
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
      {Array.isArray(posRatioData?.data) &&
        posRatioData.data.map((speakerData, index) => (
          <PosRatioDatas key={index} speakerData={speakerData} />
        ))}

      <InsightInput
        insight={posRatioData?.insights || ''}
        onUpdate={(newInsight) => {
          if (posRatioData) {
            setPosratio({ ...posRatioData, insights: newInsight });
          }
        }}
        onSave={async () => {
          if (posRatioData) {
            await updatePosratio(userReportsId, posRatioData);
            alert('저장되었습니다.');
          }
        }}
      />
    </Container>
  );
}
