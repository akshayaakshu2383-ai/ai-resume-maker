async function testProxy() {
  const videoId = 'eIho2S0ZahI';
  const url = `https://youtubetranscript.com/?server_vid2=${videoId}`;
  console.log(`Testing proxy: ${url}`);
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Proxy response length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));
    
    const transcripts = text
      .match(/<text[^>]*>([\s\S]*?)<\/text>/g)
      ?.map(t => t.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
      .join(" ");
    
    console.log('Extracted text length:', transcripts?.length || 0);
  } catch (error) {
    console.error('Proxy failed:', error.message);
  }
}

testProxy();