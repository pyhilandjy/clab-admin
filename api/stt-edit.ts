import api from '@/lib/api';
import {
  User,
  SttData,
  SpeechAct,
  TalkMore,
  ActTypes,
  File,
  Quaritative,
} from '@/types/stt-edit';

export const fetchUsers = () => api.get<User[]>('/users/');

export const fetchSpeechActs = () => api.get<SpeechAct[]>('/stt/speech_acts/');

export const fetchTalkMore = () => api.get<TalkMore[]>('/stt/talk_more/');

export const fetchActTypes = () => api.get<ActTypes[]>('/stt/act_types/');

export const fetchUserFiles = (userId: string) =>
  api.get<File[]>(`/audio/user/${userId}/files`);

export const fetchSttData = (fileId: string) =>
  api.get<SttData[]>(`/stt/data/${fileId}`);

export const fetchAudioInfo = (fileId: string) =>
  api.get<{ record_time: number }>(`/audio/webm/info/${fileId}`);

export const updateText = (
  id: string,
  audioFilesId: string,
  newText: string,
  newSpeaker: string,
) =>
  api.patch('/stt/data/edit-text/', {
    id,
    audio_files_id: audioFilesId,
    new_text: newText,
    new_speaker: newSpeaker,
  });

export const addRow = (audioFilesId: string, textOrder: number) =>
  api.post('/stt/data/add-row/', {
    audio_files_id: audioFilesId,
    selected_text_order: textOrder,
  });

export const deleteRow = (audioFilesId: string, textOrder: number) =>
  api.post('/stt/data/delete-row/', {
    audio_files_id: audioFilesId,
    selected_text_order: textOrder,
  });

export const updateSpeechAct = (id: string, actId: number) =>
  api.patch('/stt/data/edit-speech-act/', { id, act_id: actId });

export const updateTalkMore = (id: string, talkMoreId: number) =>
  api.patch('/stt/data/edit-talk-more/', { id, talk_more_id: talkMoreId });

export const updateActType = (id: string, actTypeId: number) =>
  api.patch('/stt/data/edit-act-type/', { id, act_types_id: actTypeId });

export const replaceText = (
  audioFilesId: string,
  oldText: string,
  newText: string,
) =>
  api.patch('/stt/data/replace-text/', {
    audio_files_id: audioFilesId,
    old_text: oldText,
    new_text: newText,
  });

export const replaceSpeaker = (
  audioFilesId: string,
  oldSpeaker: string,
  newSpeaker: string,
) =>
  api.patch('/stt/data/replace-speaker/', {
    audio_files_id: audioFilesId,
    old_speaker: oldSpeaker,
    new_speaker: newSpeaker,
  });

export const batchEdit = (data: any) => api.post('/stt/data/batch-edit/', data);

export const runMlSpeechActType = (audioFilesId: string) =>
  api.patch(`/stt/speech-act-type/?audio_files_id=${audioFilesId}`);

export const updateturnin = (id: string, turn: boolean) =>
  api.patch(`/stt/data/is-turn/`, { id, is_turn: turn });

export const runLlmQuaritative = (fileId: string) =>
  api.get(`/stt/data/${fileId}/report/quaritative/`);

export const createQualitativeData = (quaritativeData: Quaritative) =>
  api.post('/stt/data/report/quaritative/', quaritativeData);
