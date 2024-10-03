'use client';
import { useState } from 'react';

import { Button } from '@chakra-ui/react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import axios from 'axios';

import '@react-pdf-viewer/core/lib/styles/index.css';

const ReportPage = () => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);

  const handleCreateReportButtonClick = async () => {
    console.log('Create Report Button Clicked');
    try {
      const response = await axios.get(
        `${backendUrl}/reports/17e5d713-c3c1-446c-8a81-022b1173a61d/`,
        {
          responseType: 'blob', // Ensure the response is a blob
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Set PDF source for viewer
      setPdfSrc(url);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  return (
    <div>
      <Button onClick={handleCreateReportButtonClick}>Create Report</Button>
      {pdfSrc && (
        <Worker workerUrl='/pdf.worker.min.js'>
          <div style={{ height: '750px' }}>
            <Viewer fileUrl={pdfSrc} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default ReportPage;
