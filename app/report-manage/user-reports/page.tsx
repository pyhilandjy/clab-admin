import { notFound } from 'next/navigation';
import React from 'react';

import ReportCardLayout from './components/report-card-layout';
import ReportInfo from './components/report-info';
import PosRatio from './pos-ratio';
import SentenceLength from './sentence-length';
import SpeechAct from './speech-act';
import WordCloud from './word-cloud';

interface Props {
  searchParams: { user_reports_id?: string };
}

const UserReportsPage = ({ searchParams }: Props) => {
  const userReportsId = searchParams?.user_reports_id || '';

  if (!userReportsId) {
    return notFound();
  }

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
      <ReportCardLayout title='문장분류'>
        <SpeechAct userReportsId={userReportsId} />
      </ReportCardLayout>
    </div>
  );
};

export default UserReportsPage;
