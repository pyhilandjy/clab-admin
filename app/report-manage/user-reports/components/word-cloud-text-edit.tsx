import { useState, useEffect } from 'react';

import { Box, Input, VStack, HStack, Text, Divider } from '@chakra-ui/react';

import { SpeakerData } from '@/types/user_reports';

export interface EditCache {
  words: Record<string, string>; // oldWord -> newWord
  counts: Record<string, number>; // word -> count
}

interface WordCloudTextEditProps {
  speakerData: SpeakerData;
  onUpdate?: (speaker: string, changes: EditCache) => void;
}

export default function WordCloudTextEdit({
  speakerData,
  onUpdate,
}: WordCloudTextEditProps) {
  const [editCache, setEditCache] = useState<EditCache>({
    words: {},
    counts: {},
  });

  useEffect(() => {
    if (
      Object.keys(editCache.words).length > 0 ||
      Object.keys(editCache.counts).length > 0
    ) {
      onUpdate?.(speakerData.speaker, editCache);
    }
  }, [editCache, onUpdate, speakerData.speaker]);

  const handleWordChange = (oldWord: string, newWord: string) => {
    setEditCache((prev) => ({
      ...prev,
      words: {
        ...prev.words,
        [oldWord]: newWord,
      },
    }));
  };

  const handleValueChange = (word: string, value: number) => {
    setEditCache((prev) => ({
      ...prev,
      counts: {
        ...prev.counts,
        [word]: value,
      },
    }));
  };

  return (
    <Box
      borderWidth='1px'
      borderRadius='md'
      padding={4}
      width='100%' // 전체 너비 사용
      height='100%' // 전체 높이 사용
    >
      <HStack justifyContent='space-between' marginBottom={4}>
        <Text fontWeight='bold' fontSize='lg'>
          {speakerData.speaker} - Text Edit
        </Text>
      </HStack>
      <Divider my={2} />
      <VStack
        align='start'
        spacing={2}
        width='100%' // 전체 너비 사용
      >
        {Object.entries(speakerData.word_counts).map(([word, count]) => (
          <HStack
            key={word}
            spacing={5}
            justifyContent='space-between'
            width='100%'
          >
            <Input
              defaultValue={word}
              onChange={(e) => handleWordChange(word, e.target.value)}
              flex='1' // 남은 공간 모두 사용
              height='30px'
              placeholder='Word'
              fontSize='14px'
            />
            <Input
              type='number'
              defaultValue={count}
              onChange={(e) =>
                handleValueChange(word, parseInt(e.target.value, 10) || 0)
              }
              width='60px'
              height='30px'
              textAlign='center'
              fontSize='14px'
            />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
