import { useEffect, useState } from 'react';

import { Grid, GridItem, Container, Button, Collapse } from '@chakra-ui/react';

import { createWordCloud, updateWordCloudData } from '@/api/user_report';
import { WordcloudData } from '@/types/user_reports';

import InsightInput from './components/insight-input';
import WordCloudCanvas from './components/word-cloud-canvas';
import WordCloudTextEdit from './components/word-cloud-text-edit';
import { EditCache } from './components/word-cloud-text-edit';

interface WordCloudProps {
  userReportsId: string;
}

export default function WordCloud({ userReportsId }: WordCloudProps) {
  const [wordCloudData, setWordCloudData] = useState<WordcloudData | null>(
    null,
  );
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  // 수정된 데이터를 임시 저장할 상태
  const [editedData, setEditedData] = useState<WordcloudData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await createWordCloud(userReportsId);
      setWordCloudData(data);
      setEditedData(data); // 초기 데이터로 설정
    };

    loadData();
  }, [userReportsId]);

  // Insight 업데이트 핸들러
  const handleInsightUpdate = (newInsight: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        insights: newInsight,
      });
    }
  };

  // WordCloud 데이터 업데이트 핸들러
  const handleWordCloudUpdate = (speaker: string, changes: EditCache) => {
    if (!editedData) return;

    setEditedData({
      ...editedData,
      data: editedData.data.map((speakerData) => {
        if (speakerData.speaker !== speaker) return speakerData;

        // 단어와 빈도수 업데이트
        const updatedWordCounts: Record<string, number> = {
          ...speakerData.word_counts,
        };

        // 단어 변경 처리
        Object.entries(changes.words).forEach(([oldWord, newWord]) => {
          if (oldWord in updatedWordCounts) {
            const count = updatedWordCounts[oldWord];
            delete updatedWordCounts[oldWord];
            updatedWordCounts[newWord] = count;
          }
        });

        // 빈도수 변경 처리
        Object.entries(changes.counts).forEach(([word, count]) => {
          updatedWordCounts[word] = count;
        });

        return {
          ...speakerData,
          word_counts: updatedWordCounts,
        };
      }),
    });
  };

  // 전체 데이터 저장
  const handleSave = async () => {
    if (!editedData) return;

    console.log('editedData', editedData);
    try {
      await updateWordCloudData(userReportsId, editedData);
      setWordCloudData(editedData); // 성공 시 원본 데이터 업데이트
      alert('저장되었습니다.');
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleEditButtonClick = () => {
    setIsEditorExpanded((prev) => !prev);
  };

  return (
    <Container maxW='100%' px={4}>
      <Grid
        templateColumns={
          wordCloudData?.data.length === 1 ? '1fr' : 'repeat(2, 1fr)'
        }
        gap={6}
        width='100%'
        justifyContent='center'
        alignItems='center'
        marginBottom={8}
      >
        {wordCloudData?.data.map((speakerData, index) => (
          <GridItem key={index} width='100%'>
            <WordCloudCanvas speakerData={speakerData} />
          </GridItem>
        ))}
      </Grid>
      <InsightInput
        insight={editedData?.insights}
        onUpdate={handleInsightUpdate}
        onSave={handleSave}
      />
      <Button
        colorScheme='blue'
        onClick={handleEditButtonClick}
        width='100%'
        marginY={4}
      >
        {isEditorExpanded ? 'Hide Text Editor' : 'Show Text Editor'}
      </Button>
      <Collapse in={isEditorExpanded} animateOpacity>
        <Grid
          templateColumns={
            wordCloudData?.data.length === 1
              ? '1fr'
              : 'repeat(2, minmax(0, 1fr))'
          }
          gap={6}
          width='100%'
          alignItems='flex-start'
        >
          {editedData?.data.map((speakerData, index) => (
            <GridItem key={index} width='100%'>
              <WordCloudTextEdit
                speakerData={speakerData}
                onUpdate={handleWordCloudUpdate}
              />
            </GridItem>
          ))}
        </Grid>
        <Button
          colorScheme='blue'
          width='100%'
          marginTop={4}
          onClick={handleSave}
        >
          Save
        </Button>
      </Collapse>
    </Container>
  );
}
