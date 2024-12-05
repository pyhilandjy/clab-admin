import React from 'react';

import { Button } from '@chakra-ui/react';

const SaveResetButton = ({
  onSave,
  onReset,
  fixed = true,
}: {
  onSave: () => void;
  onReset: () => void;
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
        onClick={onSave}
        style={{ borderRadius: '50px' }}
      >
        저장
      </Button>
      <Button
        colorScheme='gray'
        size='lg'
        onClick={onReset}
        style={{ borderRadius: '50px' }}
      >
        초기화(x)
      </Button>
    </div>
  );
};

export default SaveResetButton;
