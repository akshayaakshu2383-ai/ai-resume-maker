export async function generateAIContent(prompt: string, systemPrompt: string = "You are a professional resume writer and career coach.") {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = "https://api.groq.com/openai/v1/chat/completions"; // Using Groq API

  // Check if we have a valid API key
  if (!apiKey || apiKey === "PASTE_API_KEY_HERE") {
    throw new Error("AI API key not configured. Please set AI_API_KEY in environment variables.");
  }

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("AI Generation Error:", error.message);
    throw new Error("Failed to generate AI content: " + error.message);
  }
}
