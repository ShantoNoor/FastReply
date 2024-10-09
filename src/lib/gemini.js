import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function getGeminiChatCompletion(content, modelName, system) {
  console.log(content, modelName, system);

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: system,
  });

  const chatSession = model
    .startChat({
      generationConfig,
    })
    .sendMessage(content);

  return chatSession;
}
