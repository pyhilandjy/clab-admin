import { useEffect, useRef } from 'react';

import { Box, Text, Divider } from '@chakra-ui/react';
import WordCloud from 'wordcloud';

import { WordcloudSpeakerData } from '@/types/user_reports';

interface WordCloudCanvasProps {
  speakerData: WordcloudSpeakerData;
}

export default function WordCloudCanvas({ speakerData }: WordCloudCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && Object.keys(speakerData.word_counts).length > 0) {
      const list: [string, number][] = Object.entries(speakerData.word_counts);

      WordCloud(canvasRef.current, {
        list,
        shape: 'circle',
        backgroundColor: '#fff',
        weightFactor: (size) => Math.log2(size) * 10,
        color: () => '#' + Math.floor(Math.random() * 16777215).toString(16),
        rotateRatio: 0,
      });
    }
  }, [speakerData.word_counts]);

  return (
    <Box borderWidth='1px' borderRadius='md' padding={4} height='100%'>
      <Text fontWeight='bold' fontSize='lg' marginBottom={2}>
        {speakerData.speaker}
      </Text>
      <Divider my={2} />
      <canvas ref={canvasRef} width={300} height={300} />
    </Box>
  );
}
