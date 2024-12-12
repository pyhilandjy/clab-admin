'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import { Button } from '@chakra-ui/react';

import { createWordCloud } from '@/api/user_report';

import ReportInfo from './ReportInfo';
import WordCloudComponent from './wordcloud';

const UserReportsPage = () => {
  const searchParams = useSearchParams();
  const userReportsId = searchParams.get('user_reports_id') || '';

  const handleCreateWordCloud = async () => {
    try {
      await createWordCloud(userReportsId);
    } catch (error) {
      console.error('Error creating word cloud:', error);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* ReportInfo 컴포넌트 */}
      <div
        style={{
          width: '70%',
          border: '1px solid #ccc',
          background: 'white',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <ReportInfo userReportsId={userReportsId} />
      </div>
      {/* WordCloud 텍스트 */}
      <div
        style={{
          width: '70%',
          textAlign: 'center',
          fontSize: '30px',
          color: '#333',
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        워드클라우드
        <div
          style={{
            textAlign: 'left',
          }}
        >
          <Button
            onClick={handleCreateWordCloud}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            Create Wordcloud
          </Button>
        </div>
        <div
          style={{
            width: '100%',
            border: '1px solid #ccc',
            background: 'white',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <WordCloudComponent userReportsId={userReportsId} />
        </div>
      </div>
    </div>
  );
};

export default UserReportsPage;
