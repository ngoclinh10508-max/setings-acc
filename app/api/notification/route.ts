import { NextResponse } from 'next/server';
import { sendNotificationMessage } from '../../utils/notification';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawData = body?.data;
    await sendNotificationMessage(rawData);

    return NextResponse.json({ message: 'Success', error_code: 0 }, { status: 200 });
  } catch (err) {
    console.error('Unhandled error:', err);
    return NextResponse.json(
      { message: 'Internal server error', error_code: 2 },
      { status: 500 }
    );
  }
}
