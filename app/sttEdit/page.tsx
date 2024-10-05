'use client';
import { useEffect, useRef, useState } from 'react';

import { Input, Button, Select, Grid, GridItem } from '@chakra-ui/react';

import {
  fetchUsers,
  fetchSpeechActs,
  fetchTalkMore,
  fetchActTypes,
  fetchUserFiles,
  fetchSttData,
  fetchAudioInfo,
  updateText,
  addRow,
  deleteRow,
  updateSpeechAct,
  updateTalkMore,
  updateActType,
  replaceText,
  replaceSpeaker,
  batchEdit,
  runMlSpeechActType,
} from '@/api/sttEdit';

import {
  User,
  SttData,
  SpeechAct,
  TalkMore,
  ActTypes,
  file,
} from '@/types/sttEdit';

import '@/styles/edit.css';
import Layout from '../../components/Layout';
// backendUrl 빼야함 audio 불러올때 사용중
import { backendUrl } from '../consts';

const EditPage = () => {
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const speakerRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<file[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [sttResults, setSttResults] = useState<SttData[]>([]);
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const [talkMore, setTalkMore] = useState<TalkMore[]>([]);
  const [actTypes, setActTypes] = useState<ActTypes[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const oldWordInputRef = useRef<HTMLInputElement | null>(null);
  const newWordInputRef = useRef<HTMLInputElement | null>(null);
  const oldSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const newSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const [recordTime, setRecordTime] = useState<number | null>(null);
  const [modifiedData, setModifiedData] = useState<{
    [key: string]: { [field: string]: string; audio_files_id: string };
  }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const usersResponse = await fetchUsers();
        setUsers(usersResponse.data);

        const speechActsResponse = await fetchSpeechActs();
        setSpeechAct(speechActsResponse.data);

        const talkMoreResponse = await fetchTalkMore();
        setTalkMore(talkMoreResponse.data);

        const actTypesResponse = await fetchActTypes();
        setActTypes(actTypesResponse.data);
      } catch (error) {
        console.error('초기 데이터를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    loadInitialData();
  }, []);

  const handleError = (error: unknown, customMessage: string) => {
    if (error instanceof Error) {
      console.error(customMessage, error.message);
    } else {
      console.error(customMessage, error);
    }
  };

  const handleSelectUser = async (e: any) => {
    try {
      const response = await fetchUserFiles(e.target.value);
      setFiles(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        setFiles([]);
        alert('해당 사용자의 STT 데이터가 없습니다.');
      } else {
        handleError(error, '유저 파일을 불러오는 중 오류가 발생했습니다:');
      }
    }
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
      const response = await fetchSttData(fileId);
      setSttResults(response.data);
      const infoResponse = await fetchAudioInfo(fileId);
      setRecordTime(infoResponse.data.record_time);
    } catch (error) {
      if (error instanceof Error) {
        console.error('오류가 발생했습니다!', error.message);
      }
      // 404 에러 처리
      if (error instanceof Error && error.message.includes('404')) {
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

  const handleOnSave = async (sttData: SttData) => {
    const newText = inputRefs.current[sttData.id]?.value;
    const newSpeaker = speakerRefs.current[sttData.id]?.value;
    if (!newText || !newSpeaker) {
      alert('텍스트와 화자는 빈 값일 수 없습니다. 행을 삭제해주세요');
      return;
    }
    try {
      await updateText(sttData.id, sttData.audio_files_id, newText, newSpeaker);
    } catch (error) {
      handleError(error, '저장 중 오류가 발생했습니다:');
      alert('저장 실패');
    }
  };

  const handleOnClickAdd = async (sttData: SttData) => {
    try {
      await addRow(sttData.audio_files_id, sttData.text_order);
      const response = await fetchSttData(sttData.audio_files_id);
      setSttResults(response.data);
      syncInputValues(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleOnClickDelete = async (sttData: SttData) => {
    try {
      await deleteRow(sttData.audio_files_id, sttData.text_order);
      const response = await fetchSttData(sttData.audio_files_id);
      setSttResults(response.data);
      syncInputValues(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleSelectSpeechAct = async (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const actId = parseInt(selectedOption.getAttribute('data-act-id'));
    try {
      await updateSpeechAct(sttData.id, actId);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleSelectTalkMore = async (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const talkMore = parseInt(selectedOption.getAttribute('data-talk-more-id'));
    try {
      await updateTalkMore(sttData.id, talkMore);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleSelectActType = async (sttData: SttData, e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const actType = parseInt(selectedOption.getAttribute('data-act-type-id'));
    try {
      await updateActType(sttData.id, actType);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleTextChangeButtonClick = async () => {
    const oldWord = oldWordInputRef.current?.value;
    const newWord = newWordInputRef.current?.value;
    try {
      await replaceText(sttResults[0].audio_files_id, oldWord!, newWord!);
      const response = await fetchSttData(sttResults[0].audio_files_id);
      setSttResults(response.data);
      syncInputValues(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleSpeakerChangeButtonClick = async () => {
    const oldSpeaker = oldSpeakerInputRef.current?.value;
    const newSpeaker = newSpeakerInputRef.current?.value;
    try {
      await replaceSpeaker(
        sttResults[0].audio_files_id,
        oldSpeaker!,
        newSpeaker!,
      );
      const response = await fetchSttData(sttResults[0].audio_files_id);
      setSttResults(response.data);
      syncInputValues(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleBatchSave = async () => {
    const requests = Object.entries(modifiedData).map(([id, data]) => ({
      id,
      audio_files_id: data.audio_files_id,
      new_text: data.text_edited,
      new_speaker: data.speaker,
    }));
    try {
      await batchEdit(requests);
      setSuccessMessage('Save successful');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      setErrorMessage('Save failed');
      setTimeout(() => setErrorMessage(''), 2000);
      console.error('Save failed', error);
    }
  };

  const handleRunMlSpeechActType = async () => {
    if (!selectedFileId) {
      console.error('파일이 선택되지 않았습니다.');
      return;
    }

    try {
      await runMlSpeechActType(selectedFileId);
      const response = await fetchSttData(selectedFileId);
      setSttResults(response.data);
    } catch (error) {
      console.error('ML 처리 중 오류 발생 또는 데이터 갱신 실패:', error);
    }
  };

  const getActNameById = (id: number): string => {
    const act = speechAct.find((act: SpeechAct) => act.id === id) as
      | SpeechAct
      | undefined;
    return act ? act.act_name : '';
  };

  const getTalkMoreById = (id: number): string => {
    const talk_more_data = talkMore.find(
      (talk_more: TalkMore) => talk_more.id === id,
    ) as TalkMore | undefined;
    return talk_more_data ? talk_more_data.talk_more : '';
  };

  const getActTypeById = (id: number): string => {
    const actType = actTypes.find((actType: ActTypes) => actType.id === id) as
      | ActTypes
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
    audio_files_id: string,
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
                      sttData.audio_files_id,
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
                      sttData.audio_files_id,
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
