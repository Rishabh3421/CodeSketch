import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, orderId, customerId, customerEmail, customerPhone } = body;

    // console.log("🚀 Incoming order body:", body);
    // console.log("🔐 App ID:", process.env.CASHFREE_APP_ID);
    // console.log("🔐 Secret Key:", process.env.CASHFREE_SECRET_KEY);

    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: customerId,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        order_meta: {
          return_url: `https://code-sketch-rw9v.vercel.app/credits?order_id=${orderId}`, 
        }
      },
      {
        headers: {
          'x-api-version': '2022-09-01',
          'Content-Type': 'application/json',
          'x-client-id': process.env.CASHFREE_APP_ID!,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY!
        }
      }
    );

    return NextResponse.json({
      payment_session_id: response.data.payment_session_id
    });

  } catch (error: any) {
    console.error("❌ Order Creation Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to create order" },
      { status: 500 }
    );
  }
}
