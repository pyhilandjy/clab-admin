'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import ReportCardLayout from './components/report-card-layout';
import ReportInfo from './components/report-info';
import PosRatio from './pos-ratio';
import SentenceLength from './sentence-length';
import SpeechAct from './speech-act';
import WordCloud from './word-cloud';

const UserReportsDynamic = () => {
  const searchParams = useSearchParams();
  const userReportsId = searchParams.get('user_reports_id') || '';

  if (!userReportsId) {
    return <div>유효한 report ID가 없습니다.</div>;
  }

  return (
    <>
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
    </>
  );
};

export default UserReportsDynamic;
