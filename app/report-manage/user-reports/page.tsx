'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import ReportCardLayout from './components/report-card-layout';
import ReportInfo from './components/report-info';
import WordCloud from './word-cloud';
import SentenceLength from './sentence-length';
import PosRatio from './pos-ratio';

const UserReportsPage = () => {
  const searchParams = useSearchParams();
  const userReportsId = searchParams.get('user_reports_id') || '';

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
      <ReportInfo userReportsId={userReportsId} />
      <ReportCardLayout title='워드클라우드'>
        <WordCloud userReportsId={userReportsId} />
      </ReportCardLayout>
      <ReportCardLayout title='문장길이'>
        <SentenceLength userReportsId={userReportsId} />
      </ReportCardLayout>
      <ReportCardLayout title='품사분류'>
        <PosRatio userReportsId={userReportsId} />
      </ReportCardLayout>
    </div>
  );
};

export default UserReportsPage;
