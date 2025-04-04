"use client";
import { useAuthContext } from "@/app/provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DesignCard from "./_components/DesignCard";
import { RECORD } from "@/app/view-code/[uid]/page";
import { Loader2 } from "lucide-react";

const Designs = () => {
  const { user } = useAuthContext();
  const [sketchList, setSketchList] = useState<RECORD[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      GetUserSketchHistory();
    }
  }, [user]);

  const GetUserSketchHistory = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/code-sketch?email=" + user?.email);
      console.log("User Sketches:", result.data);
      setSketchList(result.data);
    } catch (error) {
      console.error("Failed to fetch sketch history", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Designs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      ) : sketchList.length === 0 ? (
        <p>No designs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sketchList.map((sketch: RECORD, idx) => (
            <DesignCard key={idx} sketch={sketch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Designs;
