const { fetchTranscript } = require('youtube-transcript');

async function test() {
  const videoId = 'eIho2S0ZahI'; // The TED Talk ID
  console.log(`Testing transcript fetch for ID: ${videoId}...`);
  
  try {
    const transcript = await fetchTranscript(videoId);
    console.log('✅ SUCCESS! Your local machine can reach YouTube transcripts.');
    console.log(`Fetched ${transcript.length} lines of text.`);
  } catch (error) {
    console.error('❌ FAILED locally:', error.message);
  }
}

test();