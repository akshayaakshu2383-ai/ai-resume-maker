import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Robust Video ID Extraction
    const videoIdMatch = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL format" }, { status: 400 });
    }

    console.log(`Attempting stealth fetch for Video ID: ${videoId}`);

    // Fetch Transcript with Stealth Headers
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: (url: any, info: any) => fetch(url, {
        ...info,
        headers: {
          ...(info?.headers || {}),
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      })
    });

    const fullText = transcriptArray.map((t) => t.text).join(" ");

    // Summarize with AI
    const prompt = `Please summarize the following YouTube video transcript. Provide a concise overview, key takeaways as bullet points, and a final conclusion.
    Transcript: ${fullText.substring(0, 15000)} // Limit to fit context
    Return the response as a JSON string with keys: overview, bulletPoints (array), and conclusion.`;

    const aiResponse = await generateAIContent(prompt, "You are an expert content summarizer.");
    
    let parsedContent;
    try {
        parsedContent = JSON.parse(aiResponse);
    } catch (e) {
        parsedContent = { overview: aiResponse, bulletPoints: [], conclusion: "" };
    }

    return NextResponse.json({ success: true, summary: parsedContent });
  } catch (error: any) {
    console.error("YouTube Summarizer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
