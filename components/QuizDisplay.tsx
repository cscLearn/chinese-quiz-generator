import React from 'react';
import type { Quiz, QuizResult } from '../types.ts';

interface QuizDisplayProps {
  quiz: Quiz;
  userAnswers: Record<number, number | string>;
  results: QuizResult | null;
  isSubmitted: boolean;
  showDetailedResults: boolean;
  fontSize: number;
  fontFamily: 'serif' | 'sans';
  onAnswerChange: (questionIndex: number, answer: number | string) => void;
  onCheckAnswers: () => void;
  onShowDetailedResults: () => void;
  onRestart: () => void;
  onFontSizeChange: (direction: 'increase' | 'decrease') => void;
  onFontFamilyChange: (family: 'serif' | 'sans') => void;
}

const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

const FONT_SIZE_CLASSES = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'];
const FONT_FAMILY_CLASSES = {
  serif: "font-['Noto_Serif_SC',_serif]",
  sans: "font-['Noto_Sans_SC',_sans-serif]",
};


export const QuizDisplay: React.FC<QuizDisplayProps> = ({ 
  quiz, 
  userAnswers, 
  results, 
  isSubmitted, 
  showDetailedResults, 
  fontSize,
  fontFamily,
  onAnswerChange, 
  onCheckAnswers, 
  onShowDetailedResults, 
  onRestart,
  onFontSizeChange,
  onFontFamilyChange
}) => {
  
  const allAnswered = quiz.questions.every((_, index) => userAnswers[index] !== undefined && userAnswers[index] !== '');

  const getResultClasses = (questionIndex: number, optionIndex: number) => {
    if (!showDetailedResults || !results) return 'border-slate-300 hover:border-blue-500 hover:bg-blue-50';

    const result = results.answers[questionIndex];
    if (result.isCorrect === undefined) return 'border-slate-300';
    
    const isCorrectAnswer = optionIndex === result.correctAnswer;
    const isUserChoice = optionIndex === result.userAnswer;

    if (isCorrectAnswer) {
      return 'border-green-500 bg-green-100 text-green-800 font-semibold';
    }
    if (isUserChoice && !isCorrectAnswer) {
      return 'border-red-500 bg-red-100 text-red-800 font-semibold';
    }
    return 'border-slate-300 bg-slate-50';
  };

  const MainButton: React.FC = () => {
    if (showDetailedResults) {
      return (
        <button
          onClick={onRestart}
          className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          再做一个
        </button>
      );
    }
    if (isSubmitted) {
      return (
        <button
          onClick={onShowDetailedResults}
          className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          查看解析
        </button>
      );
    }
    return (
      <button
        onClick={onCheckAnswers}
        disabled={!allAnswered}
        className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
      >
        {allAnswered ? '提交答案' : '请完成所有题目'}
      </button>
    );
  };
  
  const passageFontSizeClass = FONT_SIZE_CLASSES[fontSize] || 'text-base';
  const passageFontFamilyClass = FONT_FAMILY_CLASSES[fontFamily] || FONT_FAMILY_CLASSES.serif;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow min-h-0 lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Passage Column */}
        <div className="lg:pr-4 lg:border-r lg:border-slate-200 mb-8 lg:mb-0 relative lg:max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pt-1">
                <div className="flex justify-between items-center mb-2">
                     <h2 className="text-2xl font-bold text-slate-800">阅读短文</h2>
                     {/* Font Controls */}
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                             <span className="text-sm font-medium text-slate-600">字号:</span>
                            <button onClick={() => onFontSizeChange('decrease')} disabled={fontSize === 0} className="px-2 py-0.5 text-sm rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">-A</button>
                            <button onClick={() => onFontSizeChange('increase')} disabled={fontSize === FONT_SIZE_CLASSES.length - 1} className="px-2 py-0.5 text-lg rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">+A</button>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-slate-600">字体:</span>
                            <button onClick={() => onFontFamilyChange('serif')} className={`px-2 py-0.5 text-sm rounded-md ${fontFamily === 'serif' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}>楷体</button>
                            <button onClick={() => onFontFamilyChange('sans')} className={`px-2 py-0.5 text-sm rounded-md ${fontFamily === 'sans' ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}>黑体</button>
                        </div>
                     </div>
                </div>
                <div className="w-full h-px bg-slate-200 mt-2 mb-4"></div>
           </div>
           <div className={`text-slate-800 leading-loose ${passageFontSizeClass} ${passageFontFamilyClass}`}>
             {quiz.passage.split(/\n+/).map((paragraph, index) => (
                <p key={index} className="[text-indent:2em] mb-4">
                    {paragraph}
                </p>
             ))}
           </div>
        </div>

        {/* Questions Column */}
        <div className="relative lg:max-h-[calc(100vh-220px)] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-slate-800 sticky top-0 bg-white/80 backdrop-blur-sm z-10">问题</h2>
          <div className="space-y-8">
            {quiz.questions.map((q, qIndex) => (
              <div key={qIndex}>
                <p className="font-semibold text-lg mb-4">{qIndex + 1}. {q.questionText}</p>
                {q.type === 'mc' && (
                  <div className="space-y-3">
                    {q.options!.map((option, oIndex) => (
                      <label 
                        key={oIndex} 
                        className={`flex items-start p-4 border rounded-lg transition-all ${isSubmitted ? 'cursor-default' : 'cursor-pointer'} ${getResultClasses(qIndex, oIndex)}`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={userAnswers[qIndex] === oIndex}
                          onChange={() => onAnswerChange(qIndex, oIndex)}
                          className="hidden"
                          disabled={isSubmitted}
                        />
                        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 rounded-full mr-4 mt-0.5 transition-colors ${userAnswers[qIndex] === oIndex ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400 text-slate-600'}`}>
                          {getOptionLabel(oIndex)}
                        </span>
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'sa' && (
                  <div>
                    <textarea
                      rows={4}
                      value={(userAnswers[qIndex] as string) || ''}
                      onChange={(e) => onAnswerChange(qIndex, e.target.value)}
                      disabled={isSubmitted}
                      placeholder="请在此输入你的答案..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100 bg-white text-slate-900"
                    />
                     {showDetailedResults && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="font-semibold text-sm text-green-800">参考答案:</p>
                            <p className="text-green-900">{q.correctAnswerText}</p>
                        </div>
                     )}
                  </div>
                )}
                 {showDetailedResults && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-sm text-yellow-800">💡 解答:</p>
                    <p className="text-yellow-900 text-sm leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t flex-shrink-0">
        {isSubmitted && results && (
           <div className="flex flex-col md:flex-row items-center justify-between bg-slate-100 p-4 rounded-lg mb-4">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <span className="text-xl font-bold text-slate-800">
                {results.totalMcQuestions > 0 
                    ? `你的得分: ${results.score} / ${results.totalMcQuestions}`
                    : '简答题已提交'
                }
              </span>
              {results.totalMcQuestions === 0 && <p className="text-sm text-slate-500">请参照参考答案和解析进行自评。</p>}
            </div>
             <div className="w-full md:w-auto">
                <MainButton />
            </div>
           </div>
        )}
        {!isSubmitted && <MainButton />}
      </div>
    </div>
  );
};