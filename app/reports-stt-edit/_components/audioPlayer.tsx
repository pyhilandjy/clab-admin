import React, { useRef, useEffect } from 'react';

import WaveSurfer from 'wavesurfer.js';

type Props = {
  audioUrl: string | null;
};

const AudioPlayer = ({ audioUrl }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl || !containerRef.current || !audioElementRef.current) return;

    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#c0c0c0',
      progressColor: '#555',
      height: 80,
      mediaControls: true,
      media: audioElementRef.current,
    });

    return () => {
      waveSurferRef.current?.destroy();
    };
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
        boxSizing: 'border-box',
      }}
    >
      {audioUrl ? (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <div ref={containerRef} />
          <audio
            ref={audioElementRef}
            controls
            src={audioUrl}
            style={{
              width: '100%',
              marginTop: '8px',
            }}
          />
        </div>
      ) : (
        <span style={{ fontSize: '14px', color: '#666' }}>
          Audio not available.
        </span>
      )}
    </div>
  );
};

export default AudioPlayer;
