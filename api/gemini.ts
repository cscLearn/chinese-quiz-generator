import { GoogleGenAI, Type } from "@google/genai";
import type { Quiz, Question } from '../types.ts';

// This function will be deployed as a Vercel Serverless Function.
// It runs on the server, so it can safely access environment variables.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API_KEY environment variable is not set on the server." });
  }

  const ai = new GoogleGenAI({ apiKey });

  const quizSchema = {
    type: Type.OBJECT,
    properties: {
      passage: {
        type: Type.STRING,
        description: "一段与主题相关的中文短文。",
      },
      questions: {
        type: Type.ARRAY,
        description: "一个问题对象的列表。",
        items: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: "问题类型, 'mc' 代表选择题, 'sa' 代表简答题。",
            },
            questionText: {
              type: Type.STRING,
              description: "问题的文本。",
            },
            options: {
              type: Type.ARRAY,
              description: "一个包含四个字符串选项的数组 (仅用于 'mc' 类型)。",
              items: {
                type: Type.STRING,
              },
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: "正确答案在 'options' 数组中的索引 (0-3) (仅用于 'mc' 类型)。",
            },
            correctAnswerText: {
              type: Type.STRING,
              description: "简答题的参考答案 (仅用于 'sa' 类型)。"
            },
            explanation: {
              type: Type.STRING,
              description: "对正确答案的详细解释，说明为什么它是正确的，可以引用原文。"
            }
          },
          required: ["type", "questionText", "explanation"],
        },
      },
    },
    required: ["passage", "questions"],
  };

  try {
    const { difficulty, topic, numQuestions, questionType } = req.body;
    
    if (!difficulty || !topic || !numQuestions || !questionType) {
        return res.status(400).json({ error: "Missing required parameters in the request body." });
    }

    const prompt = `
      请根据以下要求生成一个中文阅读理解测验：
      1. **主题**: "${topic}" (如果主题是 "随机一个有趣的主题", 请你选择一个适合该难度等级的常见话题。)
      2. **难度**: "${difficulty}"
      3. **问题数量**: ${numQuestions}
      4. **题目类型**: "${questionType}" (选择题, 简答题, 或 混合)

      要求：
      - 生成一篇与主题和难度相符的中文短文。文章需要结构清晰，根据内容自然分段，并使用换行符 (\\n) 分隔段落，以便阅读。
      - 根据短文内容和指定的题目类型出 ${numQuestions} 道题。
      - 如果是选择题 ('mc')，必须提供 'options' (四个选项) 和 'correctAnswerIndex'。
      - 如果是简答题 ('sa')，必须提供 'correctAnswerText'。
      - 必须为每一道题提供详细的 'explanation'，解释为什么答案是正确的，可以结合原文内容进行说明。
      - 确保问题和选项的语言难度与所选级别匹配。
      - 严格按照提供的JSON schema格式返回结果。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText) as Quiz;

    // A simple validation
    if (!quizData.passage || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz data structure received from API.");
    }
    
    // Send the successful response back to the frontend
    res.status(200).json(quizData);

  } catch (error) {
    console.error("Error in serverless function calling Gemini API:", error);
    res.status(500).json({ error: "Failed to generate quiz from API." });
  }
}