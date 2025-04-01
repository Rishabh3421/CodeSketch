"use client";

import { CloudUpload, X, WandSparkles } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const AIModels =[
    {
      name:"Gemini Google",
      icon:"/google.png"
    },{
      name:"llama By Meta",
      icon:"/meta.png" 
    },
    {
      name:"Deepseek",
      icon:"/deepseek.png"
    }
  ] 

  const onImgSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(imgUrl);
    }
  };

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="p-7 border border-dashed rounded-md flex flex-col items-center justify-center shadow-md">
            <CloudUpload className="h-10 w-10" />
            <h2 className="font-extrabold text-2xl mt-4">Upload Your Image</h2>
            <p className="text-center text-sm mt-1 opacity-50">
              Select an image or drag and drop a file
            </p>
            <div className="p-5 border-dashed w-full flex items-center justify-center mt-7">
              <label htmlFor="fileUpload">
                <h2 className="p-2 bg-primary text-white rounded-md px-5 cursor-pointer hover:scale-110 transition-transform duration-500 ease-in-out">
                  Select an Image
                </h2>
              </label>
            </div>
            <input
              type="file"
              className="hidden"
              id="fileUpload"
              multiple={false}
              onChange={onImgSelect}
            />
          </div>
        ) : (
          <div className="relative p-5 border border-dashed">
            <button
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-200 transition"
              onClick={() => setPreviewUrl(null)}
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <Image
              src={previewUrl}
              width={500}
              height={500}
              className="w-full h-[300px] object-contain"
              alt="Preview"
            />
          </div>
        )}
        <div className="p-7 w-full border rounded-lg shadow-md">
          <h2 className="">Select AI Model</h2>
          <Select>
            <SelectTrigger className="w-[180px] mt-2 mb-4">
              <SelectValue placeholder="Models list" />
            </SelectTrigger>
            <SelectContent>
              {AIModels.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  <div className="flex flex-row gap-2">
                    <Image className="object-contain" src={model.icon} alt={model.name} width={10} height={10}/>
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="font-extrabold text-xl">Describe Your Webpage</h2>
          <Textarea
            className="border-2 w-full border-dashed rounded-lg font-md shadow-sm p-5 mt-4 h-[200px] text-xl resize-none text-gray-900 placeholder-gray-400"
            placeholder="Write a brief description of your webpage..."
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-end">
        <Button>
          {" "}
          <WandSparkles /> Convert to Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
