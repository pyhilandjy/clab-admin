import React, { useEffect, useState } from 'react';

import {
  fetchSpeechActsPrompts,
  updateSpeechActsPrompts,
} from '@/api/stt-edit';

const LLMPrompt = ({
  systemPrompt,
  userPrompt,
  setSystemPrompt,
  setUserPrompt,
  onSave,
  onCancel,
}: {
  systemPrompt: string;
  userPrompt: string;
  setSystemPrompt: (value: string) => void;
  setUserPrompt: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);
  const [localUserPrompt, setLocalUserPrompt] = useState(userPrompt);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const response = await fetchSpeechActsPrompts();
        const { system_prompt, user_prompt } = response.data[0];
        setLocalSystemPrompt(system_prompt);
        setLocalUserPrompt(user_prompt);
      } catch (error) {
        console.error(
          '프롬프트 데이터를 불러오는 중 오류가 발생했습니다:',
          error,
        );
      }
    };

    loadPrompts();
  }, []);

  const handleSave = async () => {
    try {
      await updateSpeechActsPrompts({
        system_prompt: localSystemPrompt,
        user_prompt: localUserPrompt,
      });
      setSystemPrompt(localSystemPrompt);
      setUserPrompt(localUserPrompt);
      alert('프롬프트가 성공적으로 저장되었습니다.');
      onSave();
    } catch (error) {
      console.error('프롬프트 저장 중 오류가 발생했습니다:', error);
      alert('프롬프트 저장에 실패했습니다.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1001,
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          System Prompt
        </label>
        <textarea
          value={localSystemPrompt}
          onChange={(e) => setLocalSystemPrompt(e.target.value)}
          style={{
            width: '600px',
            height: '200px',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}
        >
          User Prompt
        </label>
        <textarea
          value={localUserPrompt}
          onChange={(e) => setLocalUserPrompt(e.target.value)}
          style={{
            width: '600px',
            height: '200px',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          취소
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default LLMPrompt;
