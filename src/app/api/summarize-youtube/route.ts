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

    console.log(`Attempting Manual InnerTube iOS Fetch for: ${videoId}`);

    const innerTubeResponse = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)",
            "X-Goog-Api-Format-Version": "2",
        },
        body: JSON.stringify({
            context: {
                client: {
                    clientName: "IOS",
                    clientVersion: "19.29.1",
                    deviceMake: "Apple",
                    deviceModel: "iPhone16,2",
                    osName: "iPhone",
                    osVersion: "17.5.1",
                },
            },
            videoId: videoId,
        }),
    });

    const playerResponse = await innerTubeResponse.json();
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
        return NextResponse.json({ success: false, error: "No transcripts available for this video (InnerTube Blocked)" }, { status: 404 });
    }

    // Use the first available track (usually English)
    const transcriptUrl = captionTracks[0].baseUrl;
    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptXml = await transcriptResponse.text();

    // Simple XML to Text parser
    const fullText = transcriptXml
        .match(/<text[^>]*>([\s\S]*?)<\/text>/g)
        ?.map(t => t.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
        .join(" ") || "";

    if (!fullText) {
        return NextResponse.json({ success: false, error: "Failed to parse transcript content" }, { status: 500 });
    }

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
