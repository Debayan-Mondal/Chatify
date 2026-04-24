import { GoogleGenAI } from "@google/genai";
import { ENV } from "./env.js";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY
});

async function summarizeText(message) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
    config: {
        systemInstruction: "You are a AI summarizer. Act a third person Summarizing the message. If u come across 'Place_0' or 'Person_0' these are used to hide the sensitive data. Use writting skills to make the summarization more natural and do note mention 'Place_0' or 'Person_0' bluntly like that "
    }
  });
  console.log(response.text);
}

// const message="Yo rahul wanna come to paris with me. I know I know this the 3rd time i am asking but this time we will got for sure."
// await summarizeText(message);