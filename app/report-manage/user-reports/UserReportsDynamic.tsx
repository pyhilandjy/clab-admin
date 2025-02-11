'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { regenerateReport } from '@/api/user_report';

import ReportCardLayout from './components/report-card-layout';
import ReportInfo from './components/report-info';
import Insight from './insight';
import PosRatio from './pos-ratio';
import SentenceLength from './sentence-length';
import SpeechAct from './speech-act';
import WordCloud from './word-cloud';

const UserReportsDynamic = () => {
  const [userReportsId, setUserReportsId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('user_reports_id') || '';
    setUserReportsId(id);
  }, [searchParams]);

  const handleRegenerateData = async () => {
    if (!userReportsId || isRegenerating) return;

    setIsRegenerating(true); // 버튼 비활성화

    try {
      await regenerateReport(userReportsId);
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error('데이터 재생성 실패:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!userReportsId) {
    return <div>유효한 report ID가 없습니다.</div>;
  }

  return (
    <>
      {/* 데이터 재생성 버튼 */}
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <button
          onClick={handleRegenerateData}
          disabled={isRegenerating}
          style={{
            padding: '8px 16px',
            backgroundColor: isRegenerating ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRegenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Data'}
        </button>
      </div>

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
      <ReportCardLayout title='인사이트'>
        <Insight userReportsId={userReportsId} />
      </ReportCardLayout>
    </>
  );
};

export default UserReportsDynamic;
