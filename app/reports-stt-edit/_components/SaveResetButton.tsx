import React from 'react';

import { Button } from '@chakra-ui/react';

const SaveResetButton = ({
  onSave,
  onSpeechActLLM,
  fixed = true,
}: {
  onSave: () => void;
  onSpeechActLLM: () => void;
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
        justifyContent: 'flex-end',
        gap: '10px',
        zIndex: 1000,
      }}
    >
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
  );
};

export default SaveResetButton;
