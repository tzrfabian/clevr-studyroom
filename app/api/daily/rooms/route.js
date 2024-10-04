import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('Daily rooms API route called');
  const { roomName } = await req.json();
  console.log('Requested room name:', roomName);

  if (!process.env.DAILY_API_KEY) {
    console.error('DAILY_API_KEY is not set in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    let response = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    });

    let data;

    if (response.status === 404) {
      console.log('Room does not exist. Creating new room.');
      response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            enable_screenshare: true,
            enable_chat: true,
            start_video_off: false,
            start_audio_off: false,
            max_participants: 4,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Daily.co API error:', errorData);
        throw new Error(errorData.info || 'Failed to create room');
      }

      data = await response.json();
      console.log('Successfully created new room:', data);
    } else if (response.ok) {
      data = await response.json();
      console.log('Using existing room:', data);
    } else {
      const errorData = await response.json();
      console.error('Daily.co API error:', errorData);
      throw new Error(errorData.info || 'Failed to get or create room');
    }

    return NextResponse.json({ 
      name: data.name,
      url: data.url,
    });
  } catch (error) {
    console.error('Error in Daily rooms API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}