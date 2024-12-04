import React from 'react';
import { Input, Button, Select, Checkbox } from '@chakra-ui/react';
import { SttData, SpeechAct, TalkMore, ActTypes } from '@/types/stt-edit';

const SttRowEdit = ({
  sttResults,
  speechAct,
  actTypes,
  talkMore,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
  onUpdateSpeechAct,
  onUpdateTalkMore,
  onUpdateActType,
  onToggleTurn,
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
}) => {
  return (
    <div style={{ marginTop: '40px' }}>
      {sttResults.map((sttData) => (
        <div
          key={sttData.id}
          style={{
            marginBottom: '16px',
            padding: '10px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              defaultValue={sttData.text_edited || sttData.text_edited}
              onChange={(e) =>
                onUpdateRow(sttData.id, e.target.value, sttData.speaker)
              }
              style={{ flex: 5 }}
            />
            <Input
              defaultValue={sttData.speaker}
              onChange={(e) =>
                onUpdateRow(sttData.id, sttData.text_edited, e.target.value)
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
              maxWidth: '55%',
            }}
          >
            <Button
              onClick={() =>
                onUpdateRow(sttData.id, sttData.text_edited, sttData.speaker)
              }
              style={{
                padding: '12px 24px',
                fontSize: '16px',
              }}
            >
              Save
            </Button>
            <Button
              onClick={() =>
                onAddRow(sttData.audio_files_id, sttData.text_order)
              }
              style={{
                padding: '12px 24px',
                fontSize: '16px',
              }}
            >
              Add
            </Button>
            <Button
              onClick={() =>
                onDeleteRow(sttData.audio_files_id, sttData.text_order)
              }
              style={{
                padding: '12px 24px',
                fontSize: '16px',
              }}
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
              value={sttData.act_types_id}
              onChange={(e) =>
                onUpdateActType(sttData.id, parseInt(e.target.value))
              }
            >
              {actTypes.map((actType) => (
                <option key={actType.id} value={actType.id}>
                  {actType.act_type}
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default SttRowEdit;
