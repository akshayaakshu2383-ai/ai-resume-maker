import TranscriptClient from 'youtube-transcript-api';

async function test() {
  const videoId = 'eIho2S0ZahI';
  console.log(`Testing alternative library for ID: ${videoId}...`);
  
  try {
    const client = new TranscriptClient();
    await client.ready;
    const transcript = await client.getTranscript(videoId);
    console.log('✅ SUCCESS! Alternative library works.');
    console.log(`Fetched transcript with ${transcript.transcript.length} items.`);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
  }
}

test();