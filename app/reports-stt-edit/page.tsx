'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const SttEditPage = () => {
  const searchParams = useSearchParams();
  const audioFilesId = searchParams.get('audioFilesId');
  const userId = searchParams.get('userId');

  useEffect(() => {
    if (audioFilesId && userId) {
      console.log(`Audio File ID: ${audioFilesId}`);
      console.log(`User ID: ${userId}`);
      // Add your logic here
    }
  }, [audioFilesId, userId]);

  return (
    <div>
      <h1>STT Edit Page</h1>
      <p>Audio File ID: {audioFilesId}</p>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default SttEditPage;
