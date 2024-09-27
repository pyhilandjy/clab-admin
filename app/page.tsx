'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { createClient } from '@/utils/supabase/client';

import Layout from '../components/Layout';
export default function Page() {
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

  return (
    <Layout>
      <Box>{'대쉬보드'}</Box>
    </Layout>
  );
}
