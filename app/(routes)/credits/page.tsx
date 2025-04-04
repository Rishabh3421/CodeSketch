"use client"
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Credits = () => {
  const { user } = useAuthContext();
  const [credits, setCredits] = useState<any>();

  useEffect(() => {
    user && fetchUserCredits();
  }, [user]);

 const fetchUserCredits = async () => {
    const result = await axios.get('/api/user?email='+user?.email)
    setCredits(result.data?.credits ?? 0);

};


  return (
    <div>
      <h2 className='font-bold text-3xl mb-5 uppercase'>Credits</h2>

      <div className="p-5 bg-slate-100 rounded-xl border flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <h2 className='font-bold text-xl'>Credits Available:</h2>
          <p className='text-lg text-gray-700'> {typeof credits === 'number' ? credits : "Loading..."}</p>
        </div>
        <Button className='hover:scale-105 hover:opacity-90'>Buy Credits</Button>
      </div>
    </div>
  );
};

export default Credits;
