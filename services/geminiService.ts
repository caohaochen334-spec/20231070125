
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export async function parseQuestions(text?: string, fileData?: { base64: string, mimeType: string }): Promise<Question[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  
  if (fileData) {
    parts.push({
      inlineData: {
        data: fileData.base64,
        mimeType: fileData.mimeType,
      },
    });
  }
  
  if (text) {
    parts.push({ text: `以下是从文档中提取的文本内容：\n${text}` });
  }

  parts.push({
    text: `你是一个专业的教育内容提取专家。请从提供的资料中提取所有的测验题目。
    
    任务要求：
    1. 准确识别题目正文、选项（如果有）、正确答案。
    2. 为每道题提供详细解析（explanation）。
    3. 判断题请转化为两个选项：["正确", "错误"]。
    4. 确保输出的 JSON 格式严谨。
    5. 所有的题目内容、选项和解析必须保持中文。`,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("AI 未能返回解析结果");
    return JSON.parse(textOutput.trim()) as Question[];
  } catch (error) {
    console.error("Gemini API Call Failed:", error);
    throw new Error("API 调用失败，请检查网络连接或确保文件内容可被识别。");
  }
}
