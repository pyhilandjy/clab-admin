import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ audioUrl }: { audioUrl: string | null }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {audioUrl ? (
        <audio
          ref={audioRef}
          controls
          style={{ width: '100%', maxWidth: '800px' }}
        >
          <source src={audioUrl} type='audio/webm' />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <span style={{ fontSize: '14px', color: '#666' }}>
          Audio not available.
        </span>
      )}
    </div>
  );
};

export default AudioPlayer;
