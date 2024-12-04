import React, { useRef } from 'react';

const EditComponent = ({
  handleWordReplace,
  handleSpeakerReplace,
  handleRunML,
  handleRunLLM,
}: {
  handleWordReplace: (oldWord: string, newWord: string) => void;
  handleSpeakerReplace: (oldSpeaker: string, newSpeaker: string) => void;
  handleRunML: () => void;
  handleRunLLM: () => void;
}) => {
  const oldWordRef = useRef<HTMLInputElement | null>(null);
  const newWordRef = useRef<HTMLInputElement | null>(null);
  const oldSpeakerRef = useRef<HTMLInputElement | null>(null);
  const newSpeakerRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2>Edit Actions</h2>

      {/* Word Replace */}
      <div style={{ marginBottom: '20px' }}>
        <input
          ref={oldWordRef}
          placeholder='Old Word'
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          ref={newWordRef}
          placeholder='New Word'
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button
          onClick={() =>
            handleWordReplace(
              oldWordRef.current?.value || '',
              newWordRef.current?.value || '',
            )
          }
          style={{ padding: '8px 12px' }}
        >
          Replace Word
        </button>
      </div>

      {/* Speaker Replace */}
      <div style={{ marginBottom: '20px' }}>
        <input
          ref={oldSpeakerRef}
          placeholder='Old Speaker'
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          ref={newSpeakerRef}
          placeholder='New Speaker'
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button
          onClick={() =>
            handleSpeakerReplace(
              oldSpeakerRef.current?.value || '',
              newSpeakerRef.current?.value || '',
            )
          }
          style={{ padding: '8px 12px' }}
        >
          Replace Speaker
        </button>
      </div>

      {/* Run ML */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleRunML}
          style={{ padding: '8px 12px', width: '100%' }}
        >
          Run ML
        </button>
      </div>

      {/* Run LLM */}
      <div>
        <button
          onClick={handleRunLLM}
          style={{ padding: '8px 12px', width: '100%' }}
        >
          Run LLM
        </button>
      </div>
    </div>
  );
};

export default EditComponent;
