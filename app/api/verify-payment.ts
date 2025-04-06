
import axios from 'axios';

export default async function handler(req, res) {
  const { orderId } = req.body;

  try {
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          'x-api-version': '2022-09-01',
          'x-client-id': process.env.NEXT_PUBLIC_CASHFREE_APP_ID,
          'x-client-secret': process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY,
        }
      }
    );

    res.status(200).json({ status: response.data.order_status });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}
