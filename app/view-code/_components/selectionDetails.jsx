import React from "react";
import Image from "next/image";
import { RECORD } from "../[uid]/page";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const SelectionDetails = ({ record, regenerateCode, isReady }) => {
  if (!record) {
    return <p>No record found</p>;
  }

  return (
    <div className="p-5 bg-[#F8F9FB] min-h-[87vh]">
      <h2 className="font-bold text-2xl mb-5 uppercase">Sketch</h2>
      <Image
        src={record?.imageURL}
        alt="Image"
        width={300}
        height={400}
        className="rounded-lg object-contain h-[200px] w-full border border-dashed p-3 bg-white"
      />

      <h2 className="font-bold text-2xl mb-3 uppercase mt-5">AI Model</h2>
      <input
        value={record?.model}
        disabled
        className="p-1 bg-white border w-full rounded-md opacity-60"
      />

      <h2 className="font-bold text-2xl mb-3 uppercase mt-5">Description</h2>
      <Textarea
        value={record?.description}
        disabled
        className="p-3 bg-white resize-none h-[180px] border rounded-md opacity-70"
      />

      <div
        className={`w-full mt-5 ${
          !isReady ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <Button
          onClick={regenerateCode}
          disabled={!isReady}
          className="w-full flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Regenerate Code
        </Button>
      </div>
    </div>
  );
};

export default SelectionDetails;
