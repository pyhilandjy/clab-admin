"use client";
import dayjs from "dayjs";
import { Button, Select } from "@chakra-ui/react";
import axios from "axios";
import { TuiDatePicker } from "nextjs-tui-date-picker";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

type User = {
  user_id: string;
};
type SpeechAct = {
  act_name: string;
  id: number;
};

type SentenceLengthData = {
  "가장 긴 문장": number;
  "평균 문장 길이": number;
};

type SentenceLengthResponse = {
  [speaker: string]: SentenceLengthData;
};

const ReportPage = () => {
  const backendUrl = process.env.BACKEND_URL;
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState(currentDate);
  const [recordTimeData, setRecordTimeData] = useState<any>({});
  const [sentenceLengthData, setSentenceLengthData] =
    useState<SentenceLengthResponse>({});
  const [reportmorpsData, setMorpsReportData] = useState<any>({});
  const [reportActCountData, setActCountReportData] = useState<any>({});
  const [speechAct, setSpeechAct] = useState<SpeechAct[]>([]);
  const [wordcloudimageSrc, setWordcloudImageSrc] = useState<any>(null);
  const [violinplotimageSrc, setViolinplotImageSrc] = useState(null);
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
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

  const handleCreteReportButtonClick = async () => {
    console.log("Create Report Button Clicked");
    try {
      const response = await axios.post(
        `${backendUrl}/report/pdf/`,
        {
          title: "임한나_느낌욕구_2호",
          user_id: "wnsdyd54",
        },
        {
          responseType: "blob", // Ensure the response is a blob
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfSrc(url);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <Button onClick={handleCreteReportButtonClick}>Create Report</Button>
      {pdfSrc && (
        <Worker workerUrl="/pdf.worker.min.js">
          <div style={{ height: "750px" }}>
            <Viewer fileUrl={pdfSrc} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default ReportPage;
