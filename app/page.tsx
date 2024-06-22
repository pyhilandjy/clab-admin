"use client";

import { Link } from "@chakra-ui/next-js";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
export default function Page() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      console.log(data?.user);
      if (error || !data?.user) {
        router.push("/login");
      }
    };
    checkUser();
  }, [supabase, router]);

  return (
    <Box>
      <Link
        href="/edit"
        color="blue.400"
        _hover={{ color: "blue.500" }}
        display="block"
        mb={4}
      >
        Edit
      </Link>
      <Link
        href="/report"
        color="blue.400"
        _hover={{ color: "blue.500" }}
        display="block"
      >
        Report
      </Link>
    </Box>
  );
}
