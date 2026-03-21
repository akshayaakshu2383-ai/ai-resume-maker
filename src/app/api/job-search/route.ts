import { NextResponse } from "next/server";
import axios from "axios";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    const apiKey = process.env.FIRECRAWL_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "Firecrawl API key missing" }, { status: 500 });

    // Step 1: Scrape with Firecrawl
    // We use DuckDuckGo HTML version as it is much more scrape-friendly than Google and avoids CAPTCHAs
    const searchUrl = `https://duckduckgo.com/html/?q=site:lever.co+OR+site:greenhouse.io+${encodeURIComponent(query)}+jobs+in+${encodeURIComponent(location)}`;
    
    const scrapeResponse = await axios.post(
      "https://api.firecrawl.dev/v1/scrape",
      {
        url: searchUrl,
        formats: ["markdown"],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const markdown = scrapeResponse.data.data.markdown;

    // Step 2: Extract structured data with AI
    const prompt = `From the following markdown of a job search result, extract a list of 5 active job openings. 
    For each job, provide: title, company, location, and a direct link to apply.
    Markdown: ${markdown.substring(0, 10000)}
    Return the response as a JSON array of objects with keys: title, company, location, link.`;

    const aiResponse = await generateAIContent(prompt, "You are a professional recruiting assistant. Return ONLY a valid JSON array without any markdown formatting, backticks, or preamble text.");
    
    let jobs = [];
    try {
        // Strip markdown code blocks if the AI still includes them
        const cleanedResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        jobs = JSON.parse(cleanedResponse);
    } catch {
        console.error("AI Parse Error:", aiResponse);
        jobs = [];
    }

    return NextResponse.json({ success: true, jobs });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        console.error("Job Search Error:", error.response?.data || error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Job Search Error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
