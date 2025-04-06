
import {db}from "@/configs/firebaseConfig"';
import User from '@/models/User';

export default async function handler(req, res) {
  const { email, amount } = req.body;

  await dbConnect();

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { credits: amount } }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ credits: user.credits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update credits' });
  }
}
