import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    let prompt = "";
    if (type === "resume") {
      prompt = `Generate a professional resume content for the following details. Include a professional summary, bullet points for experience, and highlight key skills.
      Details: ${JSON.stringify(data)}
      Return the response in a structured format (JSON string) with keys: summary, experience (array of objects with role, company, duration, and bulletPoints), and skills.`;
    } else if (type === "summary") {
      prompt = `Generate a 3-4 sentence high-impact professional summary for a resume based on these details:
      Role: ${data.role}
      Experience: ${JSON.stringify(data.experience)}
      Skills: ${JSON.stringify(data.skills)}
      Focus on value proposition and key achievements. Return only the summary text.`;
    } else if (type === "projects") {
      prompt = `Rewrite the following project description into 3-4 professional, action-oriented bullet points:
      Project: ${data.name}
      Details: ${data.description}
      Return the response as a JSON array of strings: ["Point 1", "Point 2", ...]. Only return the JSON.`;
    } else if (type === "cover-letter") {
      prompt = `Write a professional cover letter for the position of ${data.jobTitle} at ${data.company}. 
      Use the following resume information: ${data.resumeData}
      Make it personalized, highlight relevant experience, and keep it to 3-4 paragraphs. Return only the cover letter text.`;
    } else if (type === "skills") {
      prompt = `Suggest a list of 10-15 professional skills (technical and soft) for the job title: "${data.role}". 
      Return the response as a JSON array of strings: ["Skill 1", "Skill 2", ...]. Only return the JSON.`;
    }

    const aiResponse = await generateAIContent(prompt);
    
    // Attempt to parse JSON if AI returned it, otherwise return as text
    let parsedContent;
    try {
        parsedContent = JSON.parse(aiResponse);
    } catch {
        parsedContent = { rawText: aiResponse };
    }

    return NextResponse.json({ success: true, content: parsedContent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
