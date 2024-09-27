'use client';
import { useEffect, useRef, useState } from 'react';
import { Input, Button, Select, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import '@/styles/edit.css';
import Layout from '../../components/Layout';
import { backendUrl } from '../consts';

type User = {
  id: string;
  name: string;
  email: string;
};

type SttData = {
  id: string;
  audio_files_id: string;
  text_order: number;
  text_edited: string;
  speaker: string;
  act_id: number;
  talk_more_id: number;
  act_types_id: number;
};

type SpeechAct = {
  act_name: string;
  id: number;
};

type TalkMore = {
  talk_more: string;
  id: number;
};

type ActType = {
  act_type: string;
  id: number;
};

type file = {
  id: string;
};

const EditPage = () => {
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const speakerRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<file[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [sttResults, setSttResults] = useState<SttData[]>([]);
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const [talkMore, setTalkMore] = useState<TalkMore[]>([]);
  const [actTypes, setActTypes] = useState<ActType[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const oldWordInputRef = useRef<HTMLInputElement | null>(null);
  const newWordInputRef = useRef<HTMLInputElement | null>(null);
  const oldSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const newSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const [recordTime, setRecordTime] = useState<number | null>(null);
  const [modifiedData, setModifiedData] = useState<{
    [key: string]: { [field: string]: string; audio_files_id: string };
  }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push('/login');
      }
    };
    checkUser();
  }, [supabase, router]);

  useEffect(() => {
    axios.get(backendUrl + '/users/').then((response) => {
      setUsers(response.data);
    });
    axios.get(backendUrl + '/stt/speech_acts/').then((response) => {
      setSpeechAct(response.data);
    });
    axios.get(backendUrl + '/stt/talk_more/').then((response) => {
      setTalkMore(response.data);
    });
    axios.get(backendUrl + '/stt/act_types/').then((response) => {
      setActTypes(response.data);
    });
  }, [backendUrl]);

  const handleSelectUser = (e: any) => {
    axios
      .get(backendUrl + `/audio/user/${e.target.value}/files`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setFiles([]);
          alert('해당 사용자의 STT 데이터가 없습니다.');
        } else {
          console.error('오류가 발생했습니다!', error);
        }
      });
  };

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSelectFileId = async (e: any) => {
    const fileId = e.target.value;
    setSelectedFileId(fileId);
    setAudioUrl(`${backendUrl}/audio/webm/${fileId}`);

    try {
      // STT 데이터 가져오기
      const response = await axios.get(`${backendUrl}/stt/data/${fileId}`);
      setSttResults(response.data);

      // 오디오 파일 정보 가져오기
      const infoResponse = await axios.get(
        `${backendUrl}/audio/webm/info/${fileId}`
      );
      setRecordTime(infoResponse.data.record_time);
    } catch (error) {
      if (error instanceof Error) {
        console.error('오류가 발생했습니다!', error.message);
      }
      // 404 에러 처리
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setSttResults([]);
        setRecordTime(null);
        alert('해당 파일에 대한 데이터가 없습니다.');
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handleOnSave = (sttData: SttData) => {
    const newText = inputRefs.current[sttData.id]?.value;
    const newSpeaker = speakerRefs.current[sttData.id]?.value;
    axios
      .patch(backendUrl + '/stt/data/edit-text/', {
        id: sttData.id,
        audio_files_id: sttData.audio_files_id,
        new_text: newText,
        new_speaker: newSpeaker,
      })
      .then((response) => {})
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleOnClickAdd = (sttData: SttData) => {
    axios
      .post(backendUrl + '/stt/data/add-row/', {
        audio_files_id: sttData.audio_files_id,
        selected_text_order: sttData.text_order,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttData.audio_files_id}`);
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleOnClickDelete = (sttData: SttData) => {
    axios
      .post(backendUrl + '/stt/data/delete-row/', {
        audio_files_id: sttData.audio_files_id,
        selected_text_order: sttData.text_order,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttData.audio_files_id}`);
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSelectSpeechAct = (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const actId = parseInt(selectedOption.getAttribute('data-act-id'));
    axios
      .patch(backendUrl + '/stt/data/edit-speech-act/', {
        id: sttData.id,
        act_id: actId,
      })
      .then((response) => {})
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSelectTalkMore = (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const talkMore = parseInt(selectedOption.getAttribute('data-talk-more-id'));
    axios
      .patch(backendUrl + '/stt/data/edit-talk-more/', {
        id: sttData.id,
        talk_more_id: talkMore,
      })
      .then((response) => {})
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSelectActType = (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const actType = parseInt(selectedOption.getAttribute('data-act-type-id'));
    axios
      .patch(backendUrl + '/stt/data/edit-act-type/', {
        id: sttData.id,
        act_types_id: actType,
      })
      .then((response) => {})
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleTextChangeButtonClick = () => {
    const oldWord = oldWordInputRef.current?.value;
    const newWord = newWordInputRef.current?.value;
    axios
      .patch(backendUrl + '/stt/data/replace-text/', {
        audio_files_id: sttResults[0].audio_files_id,
        old_text: oldWord,
        new_text: newWord,
      })
      .then((response) => {
        return axios.get(
          backendUrl + `/stt/data/${sttResults[0].audio_files_id}`
        );
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSpeakerChangeButtonClick = () => {
    const oldSpeaker = oldSpeakerInputRef.current?.value;
    const newSpeaker = newSpeakerInputRef.current?.value;
    axios
      .patch(backendUrl + '/stt/data/replace-speaker/', {
        audio_files_id: sttResults[0].audio_files_id,
        old_speaker: oldSpeaker,
        new_speaker: newSpeaker,
      })
      .then((response) => {
        return axios.get(
          backendUrl + `/stt/data/${sttResults[0].audio_files_id}`
        );
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleBatchSave = () => {
    const requests = Object.entries(modifiedData).map(([id, data]) => ({
      id,
      audio_files_id: data.audio_files_id,
      new_text: data.text_edited,
      new_speaker: data.speaker,
    }));

    axios
      .post(`${backendUrl}/stt/data/batch-edit/`, requests)
      .then((response) => {
        setSuccessMessage('save successful');
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
        console.log('save successful', response.data);
      })
      .catch((error) => {
        setErrorMessage('save failed');
        setTimeout(() => {
          setErrorMessage('');
        }, 2000);
        console.error('save failed', error);
      });
  };

  const handleRunMlSpeechActType = () => {
    axios
      .patch(
        `${backendUrl}/stt/speech-act-type/?audio_files_id=${selectedFileId}`
      )
      .then((response) => {
        return axios.get(`${backendUrl}/stt/data/${selectedFileId}`);
      })
      .then((response) => {
        setSttResults(response.data);
      })
      .catch((error) => {
        console.error('ML 처리 중 오류 발생 또는 데이터 갱신 실패:', error);
      });
  };

  const getActNameById = (id: number): string => {
    const act = speechAct.find((act: SpeechAct) => act.id === id) as
      | SpeechAct
      | undefined;
    return act ? act.act_name : '';
  };

  const getTalkMoreById = (id: number): string => {
    const talk_more_data = talkMore.find(
      (talk_more: TalkMore) => talk_more.id === id
    ) as TalkMore | undefined;
    return talk_more_data ? talk_more_data.talk_more : '';
  };

  const getActTypeById = (id: number): string => {
    const actType = actTypes.find((actType: ActType) => actType.id === id) as
      | ActType
      | undefined;
    return actType ? actType.act_type : '';
  };

  const syncInputValues = (updatedResults: SttData[]) => {
    updatedResults.forEach((result) => {
      const inputRef = inputRefs.current[result.id];
      if (inputRef) {
        inputRef.value = result.text_edited;
      }
      const speakerRef = speakerRefs.current[result.id];
      if (speakerRef) {
        speakerRef.value = result.speaker;
      }
    });
  };

  const handleInputChange = (
    id: string,
    field: string,
    value: string,
    audio_files_id: string
  ) => {
    setModifiedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [field]: value,
        audio_files_id: audio_files_id,
        text_edited:
          inputRefs.current[id]?.value || prevData[id]?.text_edited || '',
        speaker: speakerRefs.current[id]?.value || prevData[id]?.speaker || '',
      },
    }));
  };

  return (
    <Layout>
      <div className='flex'>
        <Select placeholder='Select User' onChange={handleSelectUser}>
          {users.map((user: User) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </Select>
        <Select
          placeholder='Select option'
          onChange={handleSelectFileId}
          mt={2}
        >
          {files.map((file: any) => (
            <option key={file.id} value={file.id}>
              {file.file_name} - {file.status}
            </option>
          ))}
        </Select>
        {audioUrl && (
          <div className='fixed-audio-icon'>
            <audio ref={audioRef} controls>
              <source src={audioUrl} type='audio/webm' />
              Your browser does not support the audio element.
            </audio>
            <div>총 재생 시간: {formatTime(recordTime)}</div>
          </div>
        )}
        <Grid templateColumns='repeat(4, 1fr)' gap={4} mt={3}>
          <GridItem>
            <Input placeholder='Old Word' ref={oldWordInputRef} />
          </GridItem>
          <GridItem>
            <Input placeholder='New Word' ref={newWordInputRef} />
          </GridItem>
          <GridItem>
            <Input placeholder='Old Speaker' ref={oldSpeakerInputRef} />
          </GridItem>
          <GridItem>
            <Input placeholder='New Speaker' ref={newSpeakerInputRef} />
          </GridItem>
        </Grid>

        <Grid templateColumns='repeat(2, 1fr)' gap={4} mt={1}>
          <GridItem>
            <Button onClick={handleTextChangeButtonClick}>word replace</Button>
          </GridItem>
          <GridItem>
            <Button onClick={handleSpeakerChangeButtonClick}>
              Speaker replace
            </Button>
          </GridItem>
          <GridItem>
            <Button onClick={handleBatchSave}>Save All</Button>
          </GridItem>
          <GridItem>
            <Button onClick={handleRunMlSpeechActType}>Run ML Act</Button>
          </GridItem>
        </Grid>
        {successMessage && (
          <div className='success-message'>{successMessage}</div>
        )}
        {errorMessage && <div className='error-message'>{errorMessage}</div>}
        <div style={{ marginTop: '40px' }}>
          {sttResults.map((sttData) => (
            <div key={sttData.id} style={{ marginBottom: '16px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Input
                  defaultValue={sttData.text_edited}
                  onChange={(e) =>
                    handleInputChange(
                      sttData.id,
                      'text_edited',
                      e.target.value,
                      sttData.audio_files_id
                    )
                  }
                  ref={(el: any) => (inputRefs.current[sttData.id] = el)}
                  style={{ flex: 5 }}
                />
                <Input
                  defaultValue={sttData.speaker}
                  onChange={(e) =>
                    handleInputChange(
                      sttData.id,
                      'speaker',
                      e.target.value,
                      sttData.audio_files_id
                    )
                  }
                  ref={(el: any) => (speakerRefs.current[sttData.id] = el)}
                  style={{ flex: 1 }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '5px',
                  maxWidth: '800px',
                }}
              >
                <Button onClick={() => handleOnSave(sttData)}>save</Button>
                <Button onClick={() => handleOnClickAdd(sttData)}>add</Button>
                <Button onClick={() => handleOnClickDelete(sttData)}>
                  delete
                </Button>
                <Select
                  placeholder={getActNameById(sttData.act_id)}
                  onChange={(e) => handleSelectSpeechAct(sttData, e)}
                  style={{ flex: '0 0 150px', minWidth: '100px' }}
                >
                  {speechAct.map((speechact) => (
                    <option
                      key={speechact.id}
                      data-act-id={speechact.id}
                      value={speechact.act_name}
                    >
                      {speechact.act_name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={getActTypeById(sttData.act_types_id)}
                  onChange={(e) => handleSelectActType(sttData, e)}
                  style={{ flex: '0 0 150px', minWidth: '100px' }}
                >
                  {actTypes.map((actType) => (
                    <option
                      key={actType.id}
                      data-act-type-id={actType.id}
                      value={actType.act_type}
                    >
                      {actType.act_type}
                    </option>
                  ))}
                </Select>
                <Select
                  placeholder={getTalkMoreById(sttData.talk_more_id)}
                  onChange={(e) => handleSelectTalkMore(sttData, e)}
                  style={{ flex: '0 0 150px', minWidth: '100px' }}
                >
                  {talkMore.map((talkMoreItem) => (
                    <option
                      key={talkMoreItem.id}
                      data-talk-more-id={talkMoreItem.id}
                      value={talkMoreItem.talk_more}
                    >
                      {talkMoreItem.talk_more}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default EditPage;
