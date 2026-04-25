import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { ENV } from "./env.js";
import { setTimeout } from 'node:timers/promises';

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY
});

export async function summarizeText(message) {
  const neededLength = message.length/2;
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: message,
    config: {
        systemInstruction: `You are a AI summarizer.Summarize the message as a third person such the resulted message is within ${neededLength} characters.  If u come across 'Place_0' or 'Person_0' these are used to hide the sensitive data. Use writting skills to make the summarization more natural and do note mention 'Place_0' or 'Person_0' bluntly like that.`,
    }
  });
  return response.text;
}