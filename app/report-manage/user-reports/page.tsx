import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const UserReportsDynamic = dynamic(() => import('./UserReportsDynamic'), {
  ssr: false,
});

function UserReportsFallback() {
  return <div>Loading...</div>;
}

export default function Page() {
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
      <h1 style={{ marginBottom: '20px' }}>User Reports</h1>
      <Suspense fallback={<UserReportsFallback />}>
        <UserReportsDynamic />
      </Suspense>
    </div>
  );
}
