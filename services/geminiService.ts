import type { Quiz } from '../types.ts';

export const generateQuiz = async (difficulty: string, topic: string, numQuestions: number, questionType: string): Promise<Quiz> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty,
        topic,
        numQuestions,
        questionType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `请求失败，状态码: ${response.status}`);
    }

    const quizData = await response.json();
    return quizData as Quiz;

  } catch (error) {
    console.error("调用后端 API 失败:", error);
    if (error instanceof Error) {
        throw new Error(`生成试题失败: ${error.message}`);
    }
    throw new Error("生成试题时发生未知错误。");
  }
};