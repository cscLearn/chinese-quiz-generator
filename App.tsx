import React, { useState, useCallback } from 'react';
import { QuizGeneratorForm } from './components/QuizGeneratorForm.tsx';
import { QuizDisplay } from './components/QuizDisplay.tsx';
import { Header } from './components/Header.tsx';
import { generateQuiz } from './services/geminiService.ts';
import type { Quiz, QuizResult } from './types.ts';

const defaultQuiz: Quiz = {
  passage: `端午节是中国一个非常重要的传统节日。它在农历五月初五。这个节日有很多有趣的故事和习俗。\n\n端午节最重要的活动之一是赛龙舟。人们划着长长的龙舟，在水上比赛，场面非常热闹。龙舟的形状像龙，很漂亮。\n\n另外，吃粽子也是端午节的传统。粽子是用糯米和不同的馅料做成的，外面包着竹叶。馅料可以是肉、豆沙或者红枣，味道非常好。\n\n人们过端午节，是为了纪念一位名叫屈原的诗人。屈原是一位爱国的诗人，他在两千多年前去世了。为了不让鱼吃他的身体，就把粽子扔到河里，并划船去寻找他。\n\n现在，端午节不仅是中国人庆祝的节日，在一些亚洲国家也有庆祝活动。它提醒我们记住历史，也让我们有机会和家人朋友一起享受美食和乐趣。`,
  questions: [
    {
      type: 'mc',
      questionText: '根据文章，端午节是在哪一天？',
      options: [
        '农历一月初一',
        '农历五月初五',
        '农历八月十五',
        '阳历十二月二十五日',
      ],
      correctAnswerIndex: 1,
      explanation: '文章第一段明确指出：“它在农历五月初五。”'
    },
    {
      type: 'mc',
      questionText: '文章中提到的两个主要的端午节传统习俗是什么？',
      options: [
        '吃月饼和赏月',
        '贴春联和放鞭炮',
        '赛龙舟和吃粽子',
        '扫墓和踏青',
      ],
      correctAnswerIndex: 2,
      explanation: '文章第二段和第三段分别介绍了“赛龙舟”和“吃粽子”是端午节的重要活动和传统。'
    },
    {
      type: 'sa',
      questionText: '人们过端午节是为了纪念哪位历史人物？',
      correctAnswerText: '是为了纪念爱国诗人屈原。',
      explanation: '文章第四段提到：“人们过端午节，是为了纪念一位名叫屈原的诗人。”'
    }
  ]
};

const App: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(defaultQuiz);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | string>>({});
  const [results, setResults] = useState<QuizResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(1); // 0:sm, 1:base, 2:lg, 3:xl, 4:2xl
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');

  const handleGenerateQuiz = useCallback(async (difficulty: string, topic: string, numQuestions: number, questionType: string) => {
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setUserAnswers({});
    setResults(null);
    setIsSubmitted(false);
    setShowDetailedResults(false);
    try {
      const generatedQuiz = await generateQuiz(difficulty, topic, numQuestions, questionType);
      setQuiz(generatedQuiz);
    } catch (e) {
      console.error(e);
      setError('生成试题失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswerChange = (questionIndex: number, answer: number | string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };
  
  const handleFontSizeChange = (direction: 'increase' | 'decrease') => {
    setFontSize(currentSize => {
        if (direction === 'increase') return Math.min(currentSize + 1, 4);
        return Math.max(currentSize - 1, 0);
    });
  };

  const handleFontFamilyChange = (family: 'serif' | 'sans') => {
    setFontFamily(family);
  };


  const checkAnswers = () => {
    if (!quiz) return;
    let score = 0;
    const mcQuestions = quiz.questions.filter(q => q.type === 'mc');
    const newResults: QuizResult = { score: 0, totalMcQuestions: mcQuestions.length, answers: {} };

    quiz.questions.forEach((q, index) => {
      if (q.type === 'mc') {
        const isCorrect = userAnswers[index] === q.correctAnswerIndex;
        if (isCorrect) {
          score++;
        }
        newResults.answers[index] = {
          userAnswer: userAnswers[index] as number,
          correctAnswer: q.correctAnswerIndex!,
          isCorrect: isCorrect,
        };
      } else { // short-answer
         newResults.answers[index] = {
          userAnswer: userAnswers[index] as string,
          correctAnswer: q.correctAnswerText!,
        };
      }
    });
    newResults.score = score;
    setResults(newResults);
    setIsSubmitted(true);
  };

  const handleShowDetailedResults = () => {
    setShowDetailedResults(true);
  }
  
  const restartQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setResults(null);
    setError(null);
    setIsSubmitted(false);
    setShowDetailedResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <QuizGeneratorForm onGenerate={handleGenerateQuiz} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col min-h-[calc(100vh-120px)]">
              {isLoading && (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h2 className="text-xl font-semibold text-slate-700">正在生成试题...</h2>
                  <p className="text-slate-500 mt-2">AI正在努力创作中，请稍候。</p>
                </div>
              )}
              {error && (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-red-600 bg-red-50 rounded-lg p-4">
                  <p className="font-semibold">出错了！</p>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && quiz && (
                <QuizDisplay 
                  quiz={quiz} 
                  userAnswers={userAnswers} 
                  results={results}
                  isSubmitted={isSubmitted}
                  showDetailedResults={showDetailedResults}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  onAnswerChange={handleAnswerChange} 
                  onCheckAnswers={checkAnswers}
                  onShowDetailedResults={handleShowDetailedResults}
                  onRestart={restartQuiz}
                  onFontSizeChange={handleFontSizeChange}
                  onFontFamilyChange={handleFontFamilyChange}
                />
              )}
              {!isLoading && !error && !quiz && (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <div className="text-blue-600 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M12 5c-2.481 0-4.5 1.79-4.5 4s2.019 4 4.5 4 4.5-1.79 4.5-4-2.019-4-4.5-4zm0 6c-1.379 0-2.5-1.121-2.5-2.5S10.621 6.5 12 6.5s2.5 1.121 2.5 2.5S13.379 11 12 11z"></path><path d="M12 14c-4.333 0-6.983 2.808-7.33 4.85-2.48-.124-2.67-1.758-2.67-1.758C3.033 13.682 6.136 12 12 12c.389 0 .789.022 1.196.065-1.428.435-2.607 1.258-3.473 2.332-1.274 1.583-1.63 3.606-1.63 3.606.333-1 2.667-2 6.907-2s6.573 1 6.907 2c0 0-.356-2.023-1.63-3.606-.866-1.074-2.045-1.897-3.473-2.332C12.789 14.022 12.389 14 12 14z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-700">欢迎使用 AI 中文测验生成器</h2>
                  <p className="text-slate-500 mt-2 max-w-md">请在左侧选择难度、题目类型、输入主题和问题数量，然后点击“生成试题”开始您的学习之旅。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;