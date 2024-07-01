'use client';
import { Input, Button, Select, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type User = {
  id: string;
  name: string;
  email: string;
};

type SttData = {
  id: string;
  file_id: string;
  text_order: number;
  text_edited: string;
  speaker: string;
  act_id: number;
};
type SpeechAct = {
  act_name: string;
  id: number;
};

const EditPage = () => {
  const backendUrl = process.env.BACKEND_URL;
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState([]);
  const [sttResults, setSttResults] = useState<SttData[]>([]);
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const oldWordInputRef = useRef<HTMLInputElement | null>(null);
  const newWordInputRef = useRef<HTMLInputElement | null>(null);
  const oldSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const newSpeakerInputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log(data?.user);
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
  }, []);

  const handleSelectUser = (e: any) => {
    axios
      .get(backendUrl + `/audio/user/${e.target.value}/files`)
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleSelectFileId = (e: any) => {
    axios
      .get(backendUrl + `/stt/data/${e.target.value}`)
      .then((response) => {
        setSttResults(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleOnSave = (sttData: SttData) => {
    const newText = inputRefs.current[sttData.id]?.value;

    axios
      .patch(backendUrl + '/stt/data/edit-text/', {
        id: sttData.id,
        file_id: sttData.file_id,
        new_text: newText,
      })
      .then((response) => {})
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const handleOnClickAdd = (sttData: SttData) => {
    axios
      .post(backendUrl + '/stt/data/add-row/', {
        file_id: sttData.file_id,
        selected_text_order: sttData.text_order,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttData.file_id}`);
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
    // 왜 delete 로 하면 안됨?
    axios
      .post(backendUrl + '/stt/data/delete-row/', {
        file_id: sttData.file_id,
        selected_text_order: sttData.text_order,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttData.file_id}`);
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

  const handleTextChangeButtonClick = () => {
    const oldWord = oldWordInputRef.current?.value;
    const newWord = newWordInputRef.current?.value;
    axios
      .patch(backendUrl + '/stt/data/replace-text/', {
        file_id: sttResults[0].file_id,
        old_text: oldWord,
        new_text: newWord,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttResults[0].file_id}`);
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
        file_id: sttResults[0].file_id,
        old_speaker: oldSpeaker,
        new_speaker: newSpeaker,
      })
      .then((response) => {
        return axios.get(backendUrl + `/stt/data/${sttResults[0].file_id}`);
      })
      .then((response) => {
        setSttResults(response.data);
        syncInputValues(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  const getActNameById = (id: number): string => {
    const act = speechAct.find((act: SpeechAct) => act.id === id) as
      | SpeechAct
      | undefined;
    return act ? act.act_name : '';
  };

  const syncInputValues = (updatedResults: SttData[]) => {
    updatedResults.forEach((result) => {
      const inputRef = inputRefs.current[result.id];
      if (inputRef) {
        inputRef.value = result.text_edited;
      }
    });
  };

  return (
    <div className='flex'>
      <Select placeholder='Select User' onChange={handleSelectUser}>
        {users.map((user: User) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </Select>
      <Select placeholder='Select option' onChange={handleSelectFileId} mt={2}>
        {files.map((file: any) => (
          <option key={file.id} value={file.id}>
            {file.file_name}
          </option>
        ))}
      </Select>
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
      </Grid>
      <div style={{ marginTop: '40px' }}>
        {sttResults.map((sttData) => (
          <div key={sttData.id} style={{ marginBottom: '16px' }}>
            <Input
              defaultValue={sttData.text_edited}
              ref={(el): any => (inputRefs.current[sttData.id] = el)}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '3px',
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EditPage;
