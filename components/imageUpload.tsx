"use client";

import { CloudUpload, X, WandSparkles, Loader2Icon } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AIModels } from ".././data/Constants";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/app/provider";
import { toast } from "sonner";

// Supabase configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ImageUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Function to upload image to Supabase
  const uploadImageToSupabase = async (file: File) => {
    try {
      const fileName = `wireframeImg/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw new Error(error.message);
      return supabase.storage.from("images").getPublicUrl(fileName).data
        .publicUrl;
    } catch (error: any) {
      console.error("Image upload error:", error.message);
      alert(error.message);
      return null;
    }
  };

  // Function to handle conversion button click
  const OnConvertToCodeButtonClick = async () => {
    if (!file || !model || !description) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const imgUrl = await uploadImageToSupabase(file);
    if (!imgUrl) return;

    var uid = uuidv4();
    try {
      const response = await axios.post("/api/code-sketch", {
        uid: uid,
        model,
        description,
        imageUrl: imgUrl,
        email: user?.email || "guest@example.com",
      });

      if (
        response.status === 403 ||
        response.data?.error === "Not enough credits"
      ) {
        toast("Not enough credits to convert.");
        setLoading(false);
        return;
      }
      toast("Conversion successful!");
      router.push("/view-code/" + uid);
    } catch (error: any) {
      const message = error.response?.data?.error || error.message;
      toast("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle image selection
  const onImgSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imgUrl = URL.createObjectURL(files[0]);
      setFile(files[0]);
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
          <Select onValueChange={setModel}>
            <SelectTrigger className="w-[180px] mt-2 mb-4">
              <SelectValue placeholder="Models list" />
            </SelectTrigger>
            <SelectContent>
              {AIModels.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  <div className="flex flex-row gap-2">
                    <Image
                      className="object-contain"
                      src={model.icon}
                      alt={model.name}
                      width={20}
                      height={20}
                    />
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
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end">
        <Button onClick={OnConvertToCodeButtonClick} disabled={loading}>
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <WandSparkles />
          )}
          Convert to Code
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
