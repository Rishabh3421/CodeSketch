"use client";
import Constants from "@/data/Constants";
import axios from "axios";
import { LoaderCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RECORD {
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

  useEffect(() => {
    if (uid) GetRecordInfo();
  }, [uid]);

  const GetRecordInfo = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`/api/code-sketch?uid=${uid}`);
      const response: RECORD | null = result?.data;

      if (!response || !response.description) {
        console.error("Invalid record data:", response);
        return;
      }
      
      if (!response.code) {
        await GenerateCode(response);
      } else {
        setCodeRes(response.code);
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
  
    try {
      const requestBody = {
        description: record.description + ":" + Constants.PROMPT,
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
  
        const text = decoder.decode(value).replace("jsx", "").replace("```","");
        const lines = text.split("\n").filter((line) => line.startsWith("data: "));
  
        for (const line of lines) {
          try {
            const cleanData = line.replace("data: ", "").trim();
            
            // Skip "[DONE]" messages
            if (cleanData === "[DONE]") continue;
            
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
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6">
      {loading && (
        <div className="flex items-center gap-2 text-blue-500">
          <LoaderCircleIcon className="animate-spin" />
          <span>Loading...</span>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">View Generated Code</h1>
      <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto max-h-[500px] border border-gray-700">
        {codeRes || "No code available."}
      </pre>
    </div>
  );
};

export default ViewCode;