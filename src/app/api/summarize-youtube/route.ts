import { NextResponse } from "next/server";
// @ts-ignore
import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
// @ts-ignore
import TranscriptClient from "youtube-transcript-api";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
    let videoId: string | null = null;
    let proxyFetchedText = "";
    let fullText = "";
    try {
        const { url, manualTranscript } = await req.json();
        if (!url && !manualTranscript) {
            return NextResponse.json({ error: "URL or manual transcript is required" }, { status: 400 });
        }

        async function generateSummary(fullText: string) {
            if (!fullText) throw new Error("No transcript content found");

            const prompt = `Please summarize the following YouTube video transcript. Provide:
        1. A short overview
        2. Key points as bullet points
        3. A conclusion

        Transcript:
        ${fullText.substring(0, 15000)}

        Return response in JSON format with keys:
        overview, bulletPoints, conclusion.`;

            const aiResponse = await generateAIContent(prompt, "You are an expert content summarizer.");
            
            let parsedContent;
            try {
                parsedContent = JSON.parse(aiResponse);
            } catch {
                parsedContent = { overview: aiResponse, bulletPoints: [], conclusion: "" };
            }
            return parsedContent;
        }

        // If manual transcript provided, use it directly
        if (manualTranscript) {
            fullText = manualTranscript;
            console.log("Using manual transcript");
        } else {
            // Extract Video ID
            const videoIdMatch = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
            videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) {
                return NextResponse.json(
                    { success: false, error: "Invalid YouTube URL format" },
                    { status: 400 }
                );
            }

            try {
                console.log("Trying external proxy...");
                const response = await fetch(`https://youtubetranscript.com/?server_vid2=${videoId}`);
                const transcriptXml = await response.text();
                proxyFetchedText = transcriptXml
                    .match(/<text[^>]*>([\s\S]*?)<\/text>/g)
                    ?.map(t => t.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
                    .join(" ") || "";

                if (proxyFetchedText.includes("We're sorry, YouTube is currently blocking us") || proxyFetchedText.toLowerCase().includes("no transcript")) {
                    console.warn("Proxy returned blocked payload, forcing fallback");
                    proxyFetchedText = "";
                }

                fullText = proxyFetchedText;
                console.log(`Proxy fetch length: ${fullText.length}`);
            } catch (e: any) {
                console.log("Proxy failed, falling back to library.", e?.message || e);
            }

            // Try official YouTube API if available
            if (!fullText && process.env.YOUTUBE_API_KEY) {
                console.log("Trying official YouTube API...");
                try {
                    const apiKey = process.env.YOUTUBE_API_KEY;
                    // Get captions list
                    const captionsRes = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`);
                    const captionsData = await captionsRes.json();
                    
                    if (captionsData.items && captionsData.items.length > 0) {
                        // Get the first caption track
                        const captionId = captionsData.items[0].id;
                        // Download caption
                        const captionRes = await fetch(`https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`, {
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                            }
                        });
                        if (captionRes.ok) {
                            const captionText = await captionRes.text();
                            // Parse caption (assuming SRT or similar)
                            fullText = captionText.replace(/<[^>]*>/g, '').replace(/\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+/g, '').replace(/\n\n/g, ' ').trim();
                            console.log("Official API succeeded");
                        }
                    }
                } catch (apiError: any) {
                    console.error("Official API failed:", apiError.message);
                }
            }

            if (!fullText) {
                console.log("Transcript proxy failed; trying alternative library for videoId", videoId);
                try {
                    const client = new TranscriptClient();
                    await client.ready;
                    const transcript = await client.getTranscript(videoId);
                    fullText = transcript.transcript.map((t: any) => t.text).join(" ");
                    console.log("Alternative library succeeded");
                } catch (altError: any) {
                    console.error("Alternative library failed:", altError.message);
                    console.log("Trying original library fallback");
                    try {
                        const transcript = await fetchTranscript(videoId);
                        fullText = transcript.map((t: any) => t.text).join(" ");
                        console.log("Original library fallback succeeded");
                    } catch (libError: any) {
                        console.error("Original library fallback failed:", libError.message);
                        throw new Error("All transcript fetching methods failed due to YouTube restrictions");
                    }
                }
            }
        }

        console.log(`Fetched transcript length: ${fullText.length} chars`);
        if (!fullText) {
            throw new Error("No transcript found for this video.");
        }

        const summary = await generateSummary(fullText);
        console.log("Summary generated");
        return NextResponse.json({ success: true, summary });

    } catch (error: any) {
        console.error("Error:", error);
        const message = error?.message || error?.toString() || "Failed to process video";
        return NextResponse.json(
            {
                success: false,
                error: `Failed to process video. ${message}`,
                debug: {
                    videoId: videoId,
                    proxyFetchedTextLength: proxyFetchedText?.length ?? 0,
                    fallbackUsed: fullText?.length > 0 ? "true" : "false"
                }
            },
            { status: 500 }
        );
    }
}
