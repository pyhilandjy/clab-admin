import React, { Suspense } from 'react';

import UserReportsDynamic from './UserReportsDynamic';

function UserReportsFallback() {
  return <div>Loading...</div>; // 로딩 중일 때 표시될 UI
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
