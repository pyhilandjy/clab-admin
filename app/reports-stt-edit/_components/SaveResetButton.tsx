import React from 'react';

import { Button } from '@chakra-ui/react';

const SaveResetButton = ({
  onSave,
  onSpeechActLLM,
  onEditPrompt,
  fixed = true,
}: {
  onSave: () => void;
  onSpeechActLLM: () => void;
  onEditPrompt: () => void;
  fixed?: boolean;
}) => {
  return (
    <div
      style={{
        position: fixed ? 'fixed' : 'relative',
        bottom: fixed ? '0' : undefined,
        left: fixed ? '0' : undefined,
        width: fixed ? '100%' : undefined,
        backgroundColor: fixed ? '#f9f9f9' : undefined,
        borderTop: fixed ? '1px solid #ccc' : undefined,
        padding: fixed ? '10px 20px' : undefined,
        display: 'flex',
        justifyContent: 'space-between', // 왼쪽과 오른쪽으로 버튼 배치
        gap: '10px',
        zIndex: 1000,
      }}
    >
      <Button
        colorScheme='blue'
        size='lg'
        onClick={onEditPrompt}
        style={{ borderRadius: '50px' }}
      >
        프롬프트 수정
      </Button>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          colorScheme='blue'
          size='lg'
          onClick={onSpeechActLLM}
          style={{ borderRadius: '50px' }}
        >
          문장분류
        </Button>
        <Button
          colorScheme='blue'
          size='lg'
          onClick={onSave}
          style={{ borderRadius: '50px' }}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default SaveResetButton;
