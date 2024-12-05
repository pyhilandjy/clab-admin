'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';

import {
  fetchSpeechActs,
  fetchTalkMore,
  fetchActTypes,
  fetchSttData,
  updateText,
  addRow,
  deleteRow,
  updateSpeechAct,
  updateTalkMore,
  updateActType,
  updateturnin,
  batchEdit,
  fetchAudioInfos,
  replaceText,
  replaceSpeaker,
} from '@/api/stt-edit';
import {
  SttData,
  SpeechAct,
  TalkMore,
  ActTypes,
  AudioInfos,
} from '@/types/stt-edit';

import { backendUrl } from '../consts';
import AudioPlayer from './_components/audioPlayer';
import SaveResetButton from './_components/SaveResetButton';
import SttRowEdit from './_components/SttRowEdit';

const ReportsSttEditPage = () => {
  const searchParams = useSearchParams();
  const queryAudioFilesId = searchParams.get('audioFilesId');

  const [sttResults, setSttResults] = useState<SttData[]>([]);
  const [initialSttResults, setInitialSttResults] = useState<SttData[]>([]);
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const [talkMore, setTalkMore] = useState<TalkMore[]>([]);
  const [actTypes, setActTypes] = useState<ActTypes[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioInfo, setAudioInfo] = useState<AudioInfos[]>([]);
  const oldWordInputRef = useRef<HTMLInputElement>(null);
  const newWordInputRef = useRef<HTMLInputElement>(null);
  const oldSpeakerInputRef = useRef<HTMLInputElement>(null);
  const newSpeakerInputRef = useRef<HTMLInputElement>(null);

  const localChanges = useRef<{
    [key: string]: { text_edited?: string; speaker?: string };
  }>({});

  useEffect(() => {
    if (queryAudioFilesId) {
      const loadInitialData = async () => {
        try {
          const [
            speechActsResponse,
            talkMoreResponse,
            actTypesResponse,
            sttDataResponse,
            audioInfo,
          ] = await Promise.all([
            fetchSpeechActs(),
            fetchTalkMore(),
            fetchActTypes(),
            fetchSttData(queryAudioFilesId),
            fetchAudioInfos(queryAudioFilesId),
          ]);

          setSpeechAct(speechActsResponse.data);
          setTalkMore(talkMoreResponse.data);
          setActTypes(actTypesResponse.data);
          setSttResults(sttDataResponse.data);
          setInitialSttResults(sttDataResponse.data);
          setAudioInfo(audioInfo.data);
          console.log(audioInfo.data);
          setAudioUrl(`${backendUrl}/audio/webm/${queryAudioFilesId}`);
        } catch (error) {
          console.error(
            '초기 데이터를 불러오는 중 오류가 발생했습니다:',
            error,
          );
        }
      };

      loadInitialData();
    }
    //디버그
    console.log('Updated sttResults:', sttResults);
  }, [queryAudioFilesId]);

  const handleReplaceText = async (oldWord: string, newWord: string) => {
    try {
      if (!sttResults.length || !queryAudioFilesId) return;
      await replaceText(queryAudioFilesId, oldWord, newWord);

      setSttResults((prevResults) =>
        prevResults.map((item) => ({
          ...item,
          text_edited: item.text_edited?.replace(oldWord, newWord) || '',
        })),
      );

      // 강제로 렌더링하도록 상태 변경
      setSttResults((prevResults) => [...prevResults]);

      alert('텍스트 변경 성공!');
    } catch (error) {
      console.error('텍스트 변경 실패:', error);
    }
  };

  const handleSpeakerChangeButtonClick = async (
    oldSpeaker: string,
    newSpeaker: string,
  ) => {
    try {
      if (!sttResults.length || !queryAudioFilesId) return;
      await replaceSpeaker(queryAudioFilesId, oldSpeaker, newSpeaker);

      setSttResults((prevResults) =>
        prevResults.map((item) => ({
          ...item,
          speaker: item.speaker?.replace(oldSpeaker, newSpeaker) || '',
        })),
      );

      setSttResults((prevResults) => [...prevResults]);

      alert('발화자 변경 성공!');
    } catch (error) {
      console.error('발화자 변경 실패:', error);
    }
  };

  const handleUpdateRow = async (id: string, text: string, speaker: string) => {
    try {
      const audioFilesId = sttResults.find(
        (item) => item.id === id,
      )?.audio_files_id;
      if (!audioFilesId) return;

      await updateText(id, audioFilesId, text, speaker);

      setSttResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id
            ? { ...item, text_edited: text, speaker: speaker }
            : item,
        ),
      );

      delete localChanges.current[id];
    } catch (error) {
      console.error('데이터 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleAddRow = async (audioFilesId: string, textOrder: number) => {
    try {
      await addRow(audioFilesId, textOrder);
      const updatedData = await fetchSttData(audioFilesId);
      setSttResults(updatedData.data);
    } catch (error) {
      console.error('행 추가 중 오류가 발생했습니다:', error);
    }
  };

  const handleDeleteRow = async (audioFilesId: string, textOrder: number) => {
    try {
      await deleteRow(audioFilesId, textOrder);
      const updatedData = await fetchSttData(audioFilesId);
      setSttResults(updatedData.data);
    } catch (error) {
      console.error('행 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const handleUpdateSpeechAct = async (id: string, actId: number) => {
    try {
      await updateSpeechAct(id, actId);
      setSttResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id ? { ...item, act_id: actId } : item,
        ),
      );
    } catch (error) {
      console.error('Speech Act 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleUpdateTalkMore = async (id: string, talkMoreId: number) => {
    try {
      await updateTalkMore(id, talkMoreId);
      setSttResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id ? { ...item, talk_more_id: talkMoreId } : item,
        ),
      );
    } catch (error) {
      console.error('Talk More 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleUpdateActType = async (id: string, actTypeId: number) => {
    try {
      await updateActType(id, actTypeId);
      setSttResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id ? { ...item, act_types_id: actTypeId } : item,
        ),
      );
    } catch (error) {
      console.error('Act Type 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleToggleTurn = async (id: string, isTurn: boolean) => {
    try {
      await updateturnin(id, isTurn);
      setSttResults((prevResults) =>
        prevResults.map((item) =>
          item.id === id ? { ...item, is_turn: isTurn } : item,
        ),
      );
    } catch (error) {
      console.error('Turn 상태 업데이트 중 오류가 발생했습니다:', error);
    }
  };

  const handleSaveAll = async () => {
    try {
      const mergedResults = Object.entries(localChanges.current).map(
        ([id, changes]) => {
          const original = sttResults.find((stt) => stt.id === id)!;
          return {
            id,
            audio_files_id: original.audio_files_id,
            new_text: changes.text_edited || original.text_edited || '',
            new_speaker: changes.speaker || original.speaker || '',
          };
        },
      );

      await batchEdit(mergedResults);

      // sttResults 업데이트
      setSttResults((prevResults) =>
        prevResults.map((sttData) => {
          const changes = localChanges.current[sttData.id];
          return {
            ...sttData,
            text_edited: changes?.text_edited || sttData.text_edited,
            speaker: changes?.speaker || sttData.speaker,
          };
        }),
      );

      alert('저장 성공!');
      localChanges.current = {};
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 실패');
    }
  };

  // 수정요함
  const handleResetAll = () => {
    setSttResults(initialSttResults.map((stt) => ({ ...stt })));
    localChanges.current = {};
    alert('초기화 성공!');
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* 오디오 플레이어 */}
      <div>
        <AudioPlayer audioUrl={audioUrl} />
      </div>
      <div style={{ marginTop: '90px', width: '100%', maxWidth: '1200px' }}>
        {audioInfo.length > 0 &&
          audioInfo.map((info, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '50px',
                padding: '10px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
              }}
            >
              <div>{info.record_time}</div>
              <div>{info.mission_title}</div>
              <div>{info.created_at}</div>
              <div>{info.first_name}</div>
            </div>
          ))}
      </div>

      {/* STT Row 편집 */}
      <div
        style={{
          display: 'block',
          padding: '20px',
          marginTop: '20px',
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: 'white',
        }}
      >
        <SttRowEdit
          sttResults={sttResults}
          speechAct={speechAct}
          actTypes={actTypes}
          talkMore={talkMore}
          oldWordInputRef={oldWordInputRef}
          newWordInputRef={newWordInputRef}
          oldSpeakerInputRef={oldSpeakerInputRef}
          newSpeakerInputRef={newSpeakerInputRef}
          onUpdateRow={handleUpdateRow}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          onUpdateSpeechAct={handleUpdateSpeechAct}
          onUpdateTalkMore={handleUpdateTalkMore}
          onUpdateActType={handleUpdateActType}
          onToggleTurn={handleToggleTurn}
          onReplaceText={handleReplaceText}
          onReplaceSpeaker={handleSpeakerChangeButtonClick}
          localChanges={localChanges}
        />
      </div>

      {/* 저장 및 초기화 버튼 */}
      <div>
        <SaveResetButton onSave={handleSaveAll} onReset={handleResetAll} />
      </div>
    </div>
  );
};

export default ReportsSttEditPage;
