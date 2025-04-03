"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constants from "@/data/Constants";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SelectionDetail from "../../view-code/_components/selectionDetails";
import CodeEditor from "../../view-code/_components/codeEditor";

export interface RECORD {
  id: number;
  description: string;
  code: string | null;
  imageURL: string;
  model: string;
  createdBy: string;
}

const ViewCode = () => {
  const params = useParams();
  const uid = params?.uid as string;
  const [loading, setLoading] = useState(false);
  const [codeRes, setCodeRes] = useState("");
  const [record, setRecord] = useState<RECORD | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (uid) GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    setIsReady(false);
    setCodeRes(""); // Clear previous results before new fetch

    try {
      const result = await axios.get(`/api/code-sketch?uid=${uid}`);
      const response: RECORD | null = result?.data;

      if (!response || !response.description) {
        console.error("Invalid record data:", response);
        return;
      }

      setRecord(response);

      if (!response.code) {
        await GenerateCode(response);
      } else {
        setCodeRes(response.code);
        setIsReady(true);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateCode = async (record: RECORD) => {
    if (!record.description || !record.model || !record.imageURL) {
      console.error("Missing fields in record:", record);
      return;
    }

    setLoading(true);
    setCodeRes("");
    setIsReady(false);

    try {
      const requestBody = {
        description: `${record.description}: ${Constants.PROMPT}`,
        model: record.model,
        imageUrl: record.imageURL,
      };

      console.log("Sending Request Body:", requestBody);

      const res = await fetch("/api/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        console.error("API Error:", res.status, await res.text());
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        console.error("Response body is null");
        return;
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let text = decoder.decode(value);

        // Ensure valid JSON format
        text = text.replace(/jsx|```/g, "").trim();

        const lines = text
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          try {
            const cleanData = line.replace("data: ", "").trim();

            if (cleanData === "[DONE]") continue;

            if (!cleanData.startsWith("{") || !cleanData.endsWith("}")) {
              console.warn("Skipping invalid JSON chunk:", cleanData);
              continue;
            }

            const jsonData = JSON.parse(cleanData);

            if (jsonData.choices && jsonData.choices[0].delta.content) {
              setCodeRes((prev) => prev + jsonData.choices[0].delta.content);
            }
          } catch (e) {
            console.error("Parsing Error:", e);
          }
        }
      }
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setIsReady(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <AppHeader hidesidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
          <SelectionDetail record={record} />
        </div>
        <div className="col-span-4">
          {loading ? (
            <div className="text-2xl p-10 flex flex-col h-[87vh] rounded-xl bg-slate-50 items-center justify-center">
              <Loader className="animate-spin" />
              <p>Analyzing the Image</p>
            </div>
          ) : (
            <CodeEditor codeRes={codeRes} isReady={isReady} regenerateCode={GetRecordInfo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCode;
