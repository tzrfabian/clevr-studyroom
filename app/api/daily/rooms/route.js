import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log('Daily rooms API route called');
  const { roomName } = await req.json();
  console.log('Requested room name:', roomName);

  if (!process.env.DAILY_API_KEY) {
    console.error('DAILY_API_KEY is not set in environment variables');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  console.log('DAILY_API_KEY is set');

  try {
    console.log('Attempting to create Daily.co room');
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: Math.round(Date.now() / 1000) + 3600, 
          eject_at_room_exp: true,
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 4,
          signaling_impl: 'ws', //ws = websocket
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Daily.co API error:', errorData);
      
      if (errorData.info && errorData.info.includes('already exists')) {
        console.log('Room already exists, attempting to get room details');
        const getResponse = await fetch(`https://api.daily.co/v1/rooms/${roomName}`, {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          },
        });
        
        if (getResponse.ok) {
          const roomData = await getResponse.json();
          console.log('Successfully retrieved existing room:', roomData);
          return NextResponse.json({ url: roomData.url });
        } else {
          console.error('Failed to get existing room details');
        }
      }
      
      throw new Error(errorData.info || 'Failed to create or get room');
    }

    const data = await response.json();
    console.log('Successfully created new room:', data);
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error('Error in Daily rooms API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}