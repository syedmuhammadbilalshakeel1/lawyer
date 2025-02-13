import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
console.log("OpenRouter API Key:", process.env.OPENROUTER_API_KEY);
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Ensure this is set in .env.local
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return res.status(200).json({
      response: completion.choices[0]?.message?.content || "No response",
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
}
