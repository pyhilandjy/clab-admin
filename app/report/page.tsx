'use client';

import './report.css';
import Image from 'next/image';
import { TuiDatePicker } from 'nextjs-tui-date-picker';
import { useEffect, useState } from 'react';

import {
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import dayjs from 'dayjs';

import Layout from '../../components/Layout';
import { backendUrl } from '../consts';

type User = {
  id: string;
  name: string;
  email: string;
};

type SpeechAct = {
  act_name: string;
  id: number;
};

type SentenceLengthData = {
  '가장 긴 문장': number;
  '평균 문장 길이': number;
};

type SentenceLengthResponse = {
  [speaker: string]: SentenceLengthData;
};

const ReportPage = () => {
  const currentDate = dayjs().format('YYYY-MM-DD');
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('2024-05-01');
  const [endDate, setEndDate] = useState(currentDate);
  const [recordTimeData, setRecordTimeData] = useState<any>({});
  const [sentenceLengthData, setSentenceLengthData] =
    useState<SentenceLengthResponse>({});
  const [reportmorpsData, setMorpsReportData] = useState<any>({});
  const [reportActCountData, setActCountReportData] = useState<any>({});
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const [wordcloudimageSrc, setWordcloudImageSrc] = useState<any>(null);
  const [violinplotimageSrc, setViolinplotImageSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toast = useToast();

  useEffect(() => {
    axios.get(backendUrl + '/users/').then((response) => {
      setUsers(response.data);
    });
    axios.get(backendUrl + '/stt/speech_acts/').then((response) => {
      setSpeechAct(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleStartDateChange = (date: Date) => {
    setStartDate(dayjs(date).format('YYYY-MM-DD'));
  };

  const handleEndDateChange = (date: Date) => {
    setEndDate(dayjs(date).format('YYYY-MM-DD'));
  };

  const handleSelectUser = (e: any) => {
    setUserId(e.target.value);
  };

  const handleCreteRecordTimeButtonClick = () => {
    console.log('Create RecordTime Button Clicked');
    axios
      .post(backendUrl + '/report/audio_record_time/', {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setRecordTimeData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleCretemorpsRportButtonClick = () => {
    console.log('Create morps Report Button Clicked');
    axios
      .post(backendUrl + '/report/morphs-info/', {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log('Response data:', response.data);
        setMorpsReportData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      });
  };

  const handleCreteSentenceLengthButtonClick = () => {
    console.log('Create ActCount Report Button Clicked');
    axios
      .post(backendUrl + '/report/sentence_len/', {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setSentenceLengthData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleCreteActCountReportButtonClick = () => {
    console.log('Create ActCount Report Button Clicked');
    axios
      .post(backendUrl + '/report/act-count/', {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        setActCountReportData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleCreateWordCloudButtonClick = () => {
    axios
      .post(backendUrl + '/report/wordcloud/', {
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        console.log(response.data);
        const localPaths = response.data;
        if (Array.isArray(localPaths)) {
          const urls: any = localPaths.map(
            (path) => `${backendUrl}/report/images/${path.split('/').pop()}`,
          );
          setWordcloudImageSrc(urls);
        } else {
          console.error('There was an error!');
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleCreateViolinplotButtonClick = () => {
    axios
      .post(
        backendUrl + '/report/violinplot/',
        {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
        },
        { responseType: 'blob' },
      )
      .then((response) => {
        console.log(response.data);
        const url: any = URL.createObjectURL(response.data);
        setViolinplotImageSrc(url);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleExportExcelButtonClick = () => {
    axios
      .post(
        backendUrl + '/report/csv/',
        {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
        },
        { responseType: 'blob' },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSttDataExportExcelButtonClick = () => {
    axios
      .post(
        backendUrl + '/report/stt/data/between_date/',
        {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
        },
        { responseType: 'blob' },
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stt_data.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      //   await handleUpload();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected.',
        description: 'Please select a file to upload.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', userId);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);

    try {
      const response = await axios.post(backendUrl + '/report/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Upload successful.',
        description: `File uploaded successfully with id: ${response.data.message}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed.',
        description: 'There was an error uploading the file.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <div className='flex'>
        <div className='export-button-container'>
          <Button onClick={handleExportExcelButtonClick}>
            Export Report Data to Excel
          </Button>
          <Button onClick={handleSttDataExportExcelButtonClick}>
            Export Stt Data to Excel
          </Button>
        </div>
        <Select placeholder='Select User' onChange={handleSelectUser}>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </Select>
        <div>
          start date
          <TuiDatePicker
            handleChange={handleStartDateChange}
            date={new Date(startDate)}
            inputWidth={140}
            fontSize={16}
          />
        </div>
        <div>
          end date
          <TuiDatePicker
            handleChange={handleEndDateChange}
            date={new Date(endDate)}
            inputWidth={140}
            fontSize={16}
          />
        </div>
        <Button onClick={handleCreteRecordTimeButtonClick}>
          Create Record Time
        </Button>
        {recordTimeData && (
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>녹음시간</td>
                <td>{recordTimeData['녹음시간']}</td>
              </tr>
            </tbody>
          </table>
        )}
        <Button onClick={handleCretemorpsRportButtonClick}>
          Create Morps Report
        </Button>
        {reportmorpsData && (
          <table>
            <thead>
              <tr>
                <th>Speaker</th>
                <th>고유명사</th>
                <th>명사</th>
                <th>대명사</th>
                <th>동사</th>
                <th>형용사</th>
                <th>부사</th>
                <th>총단어 수</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(reportmorpsData).map((speaker) => (
                <tr key={speaker}>
                  <td>{speaker}</td>
                  <td>{reportmorpsData[speaker]['고유명사']}</td>
                  <td>{reportmorpsData[speaker]['명사']}</td>
                  <td>{reportmorpsData[speaker]['대명사']}</td>
                  <td>{reportmorpsData[speaker]['동사']}</td>
                  <td>{reportmorpsData[speaker]['형용사']}</td>
                  <td>{reportmorpsData[speaker]['부사']}</td>
                  <td>{reportmorpsData[speaker]['총단어 수']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Button onClick={handleCreteActCountReportButtonClick}>
          Create ActCount Report
        </Button>
        {reportActCountData && (
          <table>
            <thead>
              <tr>
                <th>Speaker</th>
                {speechAct.map((act) => (
                  <th key={act.id}>{act.act_name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(reportActCountData).map((speaker) => (
                <tr key={speaker}>
                  <td>{speaker}</td>
                  {speechAct.map((act) => (
                    <td key={act.id}>
                      {reportActCountData[speaker][act.act_name] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Button onClick={handleCreteSentenceLengthButtonClick}>
          Create Sentence Length Report
        </Button>
        {sentenceLengthData && (
          <table>
            <thead>
              <tr>
                <th>Speaker</th>
                <th>가장 긴 문장</th>
                <th>평균 문장 길이</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sentenceLengthData).map(([speaker, len_data]) => (
                <tr key={speaker}>
                  <td>{speaker}</td>
                  <td>{len_data['가장 긴 문장']}</td>
                  <td>{len_data['평균 문장 길이']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div>
          <Button onClick={handleCreateWordCloudButtonClick}>
            Generate Word Cloud
          </Button>
          {wordcloudimageSrc &&
            wordcloudimageSrc.map((src: any, index: any) => (
              <Image
                key={index}
                src={src}
                alt={`Word Cloud ${index + 1}`}
                width={500}
                height={500}
                style={{ margin: '10px' }}
              />
            ))}
          <Button onClick={handleCreateViolinplotButtonClick}>
            Generate Violin Plot
          </Button>
          {violinplotimageSrc && (
            <Image
              src={violinplotimageSrc}
              alt='ViolinPlot'
              width={500}
              height={500}
              className='violingplot-image'
            />
          )}
        </div>
        <FormControl>
          <FormLabel htmlFor='file'>Upload PDF</FormLabel>
          <Input
            type='file'
            id='file'
            accept='application/pdf'
            onChange={handleFileChange}
          />
        </FormControl>
      </div>
    </Layout>
  );
};

export default ReportPage;
