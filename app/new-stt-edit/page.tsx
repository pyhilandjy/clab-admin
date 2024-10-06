'use client';
import React, { useEffect, useState } from 'react';

import { Select } from '@chakra-ui/react';

import { fetchUsers, fetchUserFiles } from '@/api/sttEdit';
import { User, file } from '@/types/sttEdit';

export default function NewSttEditPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userFiles, setUserFiles] = useState<file[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      const userResponse = await fetchUsers();
      setUsers(userResponse.data);
    }
    loadInitialData();
  }, []);

  const userFilesResponse = async (selectedUserId: string) => {
    const userFilesResponse = await fetchUserFiles(selectedUserId);
    setUserFiles(userFilesResponse.data);
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
    userFilesResponse(selectedUserId);
  };

  return (
    <div>
      <Select onChange={handleOnchange}>
        {users.map((user: User, idx: number) => (
          <option key={idx} value={user.id}>
            {user.name}, {user.email}
          </option>
        ))}
      </Select>
      <Select placeholder='select'>
        {userFiles.map((file: file, idx: number) => (
          <option key={idx} value={file.id}>
            {file.file_name}, {file.status}
          </option>
        ))}
      </Select>
    </div>
  );
}
