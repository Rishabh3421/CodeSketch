"use client";
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';

const Credits = () => {
  const { user } = useAuthContext();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);

  const fetchUserCredits = async () => {
    try {
      const result = await axios.get(`/api/user?email=${user?.email}`);
      setCredits(result.data?.credits ?? 0);
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  const handleBuyCredits = async () => {
    if (!user) return;

    try {
      const response = await axios.post('/api/create-order', {
        amount: 100,
        orderId: `order_${new Date().getTime()}`,
        customerId: user.uid ?? user.email,
        customerEmail: user.email,
        customerPhone: '9876543210',
      });

      const cashfree = await load({
        mode: 'sandbox', 
      });

      await cashfree.checkout({
        paymentSessionId: response.data.payment_session_id,
        redirectTarget: '_self',
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div>
      <h2 className='font-bold text-3xl mb-5 uppercase'>Credits</h2>
      <div className="p-5 bg-slate-100 rounded-xl border flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <h2 className='font-bold text-xl'>Credits Available:</h2>
          <p className='text-lg text-gray-700'>
            {credits !== null ? credits : "Loading..."}
          </p>
        </div>
        <Button onClick={handleBuyCredits} className='hover:scale-105 hover:opacity-90'>
          Buy Credits
        </Button>
      </div>
    </div>
  );
};

export default Credits;
