import { useState, useCallback, useRef } from 'react';

import { Box, Input, VStack, HStack, Text, Divider } from '@chakra-ui/react';

import { WordcloudSpeakerData } from '@/types/user_reports';

export interface EditCache {
  words: Record<string, string>; // oldWord -> newWord
  counts: Record<string, number>; // word -> count
}

interface WordRowProps {
  word: string;
  count: number;
  onUpdate: (oldWord: string, newWord: string, count: number) => void;
}

const WordRow = ({ word, count, onUpdate }: WordRowProps) => {
  const [localWord, setLocalWord] = useState(word);
  const [localCount, setLocalCount] = useState(count);
  const [isDirty, setIsDirty] = useState(false);

  // 입력값이 변경될 때마다 로컬 상태만 업데이트
  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalWord(e.target.value);
    setIsDirty(true);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCount(parseInt(e.target.value, 10) || 0);
    setIsDirty(true);
  };

  // blur 될 때만 상위 컴포넌트에 업데이트
  const handleBlur = () => {
    if (isDirty) {
      onUpdate(word, localWord, localCount);
      setIsDirty(false);
    }
  };

  return (
    <HStack spacing={5} justifyContent='space-between' width='100%'>
      <Input
        value={localWord}
        onChange={handleWordChange}
        onBlur={handleBlur}
        flex='1'
        height='30px'
        placeholder='Word'
        fontSize='14px'
      />
      <Input
        type='number'
        value={localCount}
        onChange={handleCountChange}
        onBlur={handleBlur}
        width='60px'
        height='30px'
        textAlign='center'
        fontSize='14px'
      />
    </HStack>
  );
};

interface WordCloudTextEditProps {
  speakerData: WordcloudSpeakerData;
  onUpdate?: (speaker: string, changes: EditCache) => void;
}

export default function WordCloudTextEdit({
  speakerData,
  onUpdate,
}: WordCloudTextEditProps) {
  const editCacheRef = useRef<EditCache>({
    words: {},
    counts: {},
  });

  const handleRowUpdate = useCallback(
    (oldWord: string, newWord: string, newCount: number) => {
      // 실제 변경사항이 있을 때만 업데이트
      if (
        oldWord === newWord &&
        editCacheRef.current.counts[oldWord] === newCount
      ) {
        return;
      }

      const newWords = { ...editCacheRef.current.words };
      const newCounts = { ...editCacheRef.current.counts };

      // oldWord가 변경되었을 경우
      if (oldWord !== newWord) {
        delete newWords[oldWord];
        delete newCounts[oldWord];
        newWords[oldWord] = newWord;
      }

      newCounts[newWord] = newCount;

      editCacheRef.current = {
        words: newWords,
        counts: newCounts,
      };

      // 변경사항을 즉시 반영
      onUpdate?.(speakerData.speaker, editCacheRef.current);
    },
    [onUpdate, speakerData.speaker],
  );

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
        {Object.entries(speakerData.word_counts).map(([word, count], index) => (
          <WordRow
            key={index}
            word={word}
            count={count}
            onUpdate={handleRowUpdate}
          />
        ))}
      </VStack>
    </Box>
  );
}
