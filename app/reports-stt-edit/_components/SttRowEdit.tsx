import React, { RefObject } from 'react';

import {
  Input,
  Button,
  Select,
  Checkbox,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';

import { SttData, SpeechAct, TalkMore, ActTypes } from '@/types/stt-edit';

const SttRowEdit = ({
  sttResults,
  speechAct,
  // actTypes,
  talkMore,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onUpdateSpeechAct,
  onUpdateTalkMore,
  // onUpdateActType,
  onToggleTurn,
  onToggleQualitative,
  onReplaceText,
  onReplaceSpeaker,
  localChanges,
  oldWordInputRef,
  newWordInputRef,
  oldSpeakerInputRef,
  newSpeakerInputRef,
}: {
  sttResults: SttData[];
  speechAct: SpeechAct[];
  actTypes: ActTypes[];
  talkMore: TalkMore[];
  onUpdateRow: (id: string, text: string, speaker: string) => void;
  onAddRow: (audioFilesId: string, textOrder: number) => void;
  onDeleteRow: (audioFilesId: string, textOrder: number) => void;
  onUpdateSpeechAct: (id: string, actId: number) => void;
  onUpdateTalkMore: (id: string, talkMoreId: number) => void;
  onUpdateActType: (id: string, actTypeId: number) => void;
  onToggleTurn: (id: string, isTurn: boolean) => void;
  onToggleQualitative: (id: string, isQualitative: boolean) => void;
  onReplaceText: (oldWord: string, newWord: string) => void;
  onReplaceSpeaker: (oldSpeaker: string, newSpeaker: string) => void;
  localChanges: React.MutableRefObject<{
    [key: string]: { text_edited?: string; speaker?: string };
  }>;
  oldWordInputRef: RefObject<HTMLInputElement>;
  newWordInputRef: RefObject<HTMLInputElement>;
  oldSpeakerInputRef: RefObject<HTMLInputElement>;
  newSpeakerInputRef: RefObject<HTMLInputElement>;
}) => {
  const handleTextChangeButtonClick = () => {
    const oldWord = oldWordInputRef.current?.value?.trim();
    const newWord = newWordInputRef.current?.value?.trim();

    if (!oldWord || !newWord) {
      alert('Old Word와 New Word를 모두 입력해야 합니다.');
      return;
    }

    onReplaceText(oldWord, newWord);

    if (oldWordInputRef.current) oldWordInputRef.current.value = '';
    if (newWordInputRef.current) newWordInputRef.current.value = '';
  };

  const handleSpeakerChangeButtonClick = () => {
    const oldSpeaker = oldSpeakerInputRef.current?.value?.trim();
    const newSpeaker = newSpeakerInputRef.current?.value?.trim();

    if (!oldSpeaker || !newSpeaker) {
      alert('Old Speaker와 New Speaker를 모두 입력해야 합니다.');
      return;
    }

    onReplaceSpeaker(oldSpeaker, newSpeaker);

    if (oldSpeakerInputRef.current) oldSpeakerInputRef.current.value = '';
    if (newSpeakerInputRef.current) newSpeakerInputRef.current.value = '';
  };

  const handleInputChange = (
    id: string,
    field: 'text_edited' | 'speaker',
    value: string,
  ) => {
    if (!localChanges.current[id]) {
      localChanges.current[id] = {};
    }
    localChanges.current[id][field] = value;
  };

  const handleSaveRow = (sttData: SttData) => {
    const changes = localChanges.current[sttData.id];
    if (!changes) {
      alert('변경 사항이 없습니다.');
      return;
    }

    const newText = changes.text_edited || sttData.text_edited;
    const newSpeaker = changes.speaker || sttData.speaker;

    onUpdateRow(sttData.id, newText, newSpeaker);

    // 저장 후 변경 사항 초기화
    delete localChanges.current[sttData.id];
  };

  return (
    <div style={{ marginTop: '10px', padding: '10px' }}>
      {/* Word Replace & Speaker Replace Section */}
      <Box marginBottom='20px'>
        <Grid templateColumns='repeat(4, 1fr)' gap={4}>
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

        <Grid templateColumns='repeat(2, 1fr)' gap={4} marginTop='10px'>
          <GridItem>
            <Button
              style={{ padding: '12px 24px', fontSize: '16px' }}
              onClick={handleTextChangeButtonClick}
            >
              Word Replace
            </Button>
          </GridItem>
          <GridItem>
            <Button
              style={{ padding: '12px 24px', fontSize: '16px' }}
              onClick={handleSpeakerChangeButtonClick}
            >
              Speaker Replace
            </Button>
          </GridItem>
        </Grid>
      </Box>
      {sttResults.map((sttData) => (
        <div
          key={`${sttData.id}-${sttData.text_edited || ''}-${sttData.speaker || ''}`}
          style={{ marginBottom: '5px', padding: '7px' }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              defaultValue={sttData.text_edited || ''}
              onChange={(e) =>
                handleInputChange(sttData.id, 'text_edited', e.target.value)
              }
              style={{ flex: 6 }}
            />
            <Input
              defaultValue={sttData.speaker || ''}
              onChange={(e) =>
                handleInputChange(sttData.id, 'speaker', e.target.value)
              }
              style={{ flex: 1 }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '5px',
              maxWidth: '70%',
            }}
          >
            <Button
              onClick={() => handleSaveRow(sttData)}
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              Save
            </Button>
            <Button
              onClick={() =>
                onAddRow(sttData.audio_files_id, sttData.text_order)
              }
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              Add
            </Button>
            <Button
              onClick={() =>
                onDeleteRow(sttData.audio_files_id, sttData.text_order)
              }
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              Delete
            </Button>
            <Select
              value={sttData.act_id}
              onChange={(e) =>
                onUpdateSpeechAct(sttData.id, parseInt(e.target.value))
              }
            >
              {speechAct.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.act_name}
                </option>
              ))}
            </Select>
            <Select
              value={sttData.talk_more_id}
              onChange={(e) =>
                onUpdateTalkMore(sttData.id, parseInt(e.target.value))
              }
            >
              {talkMore.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.talk_more}
                </option>
              ))}
            </Select>
            <Checkbox
              isChecked={sttData.is_turn}
              onChange={(e) => onToggleTurn(sttData.id, e.target.checked)}
            >
              Turn
            </Checkbox>
            <Checkbox
              isChecked={sttData.is_qualitative}
              onChange={(e) =>
                onToggleQualitative(sttData.id, e.target.checked)
              }
            >
              Qualitative
            </Checkbox>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SttRowEdit;
