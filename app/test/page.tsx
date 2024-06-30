'use client';
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ReportPage = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push('/login');
      }
    };
    checkUser();
  }, [supabase, router]);

  const handleCreateReportButtonClick = async () => {
    console.log('Create Report Button Clicked');
    try {
      const response = await axios.get(
        `${backendUrl}/reports/cf313d6a-201b-4947-9725-acbd2a0d15a6/`,
        {
          responseType: 'blob', // Ensure the response is a blob
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf'); // or any other extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
