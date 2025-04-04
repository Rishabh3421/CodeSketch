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
  uid: string;
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

  const GetRecordInfo = async (forceRegenerate = false) => {
    setLoading(true);
    setIsReady(false);
    setCodeRes("");
    try {
      const result = await axios.get(`/api/code-sketch?uid=${uid}`);
      const response: RECORD | null = result?.data;
  
      if (!response || !response.description) {
        console.error("Invalid record data:", response);
        return;
      }
  
      setRecord(response);
  
     
      if (response.code && !forceRegenerate) {
        setCodeRes(response.code);
        setIsReady(true);
        setLoading(false);
        return;
      }
  
      await GenerateCode(response);
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  };
  
  const GenerateCode = async (record: RECORD) => {
    if (!record.description || !record.model || !record.imageURL) {
      console.error("Missing fields in record:", record);
      return;
    }
  
    setCodeRes("");
    setIsReady(false);
  
    try {
      const requestBody = {
        description: `${record.description}: ${Constants.PROMPT_OLD}`,
        model: record.model,
        imageUrl: record.imageURL,
      };
  
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
      let finalCode = "";
      let loadingStopped = false;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        let text = decoder.decode(value);
        text = text.replace(/jsx|```|javascript|js/g, "").trim();
  
        const lines = text
          .split("\n")
          .filter((line) => line.startsWith("data: "));
  
        for (const line of lines) {
          try {
            const cleanData = line.replace("data: ", "").trim();
            if (cleanData === "[DONE]") continue;
  
            if (!cleanData.startsWith("{") || !cleanData.endsWith("}")) {
              continue;
            }
  
            const jsonData = JSON.parse(cleanData);
  
            if (jsonData.choices && jsonData.choices[0].delta.content) {
              const newContent = jsonData.choices[0].delta.content;
              finalCode += newContent;
              setCodeRes((prev) => prev + newContent);
  
              if (!loadingStopped) {
                setLoading(false);
                loadingStopped = true;
              }
            }
          } catch (e) {
            console.error("Parsing Error:", e);
          }
        }
      }
  
      setIsReady(true);
      await UpdateCodeDB(finalCode); 
  
    } catch (error) {
      console.error("Error generating code:", error);
      setIsReady(true);
    }
  };
  
  
  const UpdateCodeDB = async (generatedCode: string) => {
    if (!generatedCode) {
      console.error("No code to update");
      return;
    }
  
    try {
      await axios.put(`/api/code-sketch`, {
        uid: record?.uid,
        CodeResponse: generatedCode,
      });
      console.log("Code updated successfully");
    } catch (error) {
      console.error("Error updating code:", error);
    }
  };
  

  return (
    <div>
      <AppHeader hidesidebar={true} />
      <div className="grid grid-cols-1 md:grid-cols-5 p-5 gap-10">
        <div>
        <SelectionDetail record={record} isReady={isReady} regenerateCode={() => GetRecordInfo(true)} />
        </div>
        <div className="col-span-4">
          {loading ? (
            <div className="text-2xl p-10 flex flex-col h-[87vh] rounded-xl bg-slate-50 items-center justify-center">
              <Loader className="animate-spin" />
              <p>Analyzing the Image</p>
            </div>
          ) : (
            <CodeEditor codeRes={codeRes} isReady={isReady} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCode;
