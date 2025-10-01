import React, { useState, useEffect, useCallback } from 'react';

interface QuizGeneratorFormProps {
  onGenerate: (difficulty: string, topic: string, numQuestions: number, questionType: string) => void;
  isLoading: boolean;
}

const ALL_KID_FRIENDLY_TOPICS = [
  '可爱的动物', '太空探索', '恐龙世界', '有趣的节日', '神奇的自然',
  '我的家人', '好吃的食物', '运动会', '海洋生物', '童话故事',
  '超级英雄', '交通工具', '机器人', '天气变化', '保护地球',
  '传统文化', '奇妙的植物', '环游世界'
];
const NUM_DISPLAYED_TOPICS = 8;

const shuffleArray = (array: string[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const QuizGeneratorForm: React.FC<QuizGeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [difficulty, setDifficulty] = useState('中级 (HSK 3-4)');
  const [topic, setTopic] = useState('中国新年');
  const [numQuestions, setNumQuestions] = useState(3);
  const [isRandomTopic, setIsRandomTopic] = useState(false);
  const [questionType, setQuestionType] = useState('选择题');
  const [displayedTopics, setDisplayedTopics] = useState<string[]>([]);

  const refreshTopics = useCallback(() => {
    const shuffled = shuffleArray(ALL_KID_FRIENDLY_TOPICS);
    setDisplayedTopics(shuffled.slice(0, NUM_DISPLAYED_TOPICS));
  }, []);

  useEffect(() => {
    refreshTopics();
  }, [refreshTopics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = isRandomTopic ? '随机一个有趣的主题' : topic;
    if (finalTopic.trim() && !isLoading) {
      onGenerate(difficulty, finalTopic, numQuestions, questionType);
    }
  };
  
  const handleTopicButtonClick = (selectedTopic: string) => {
    setTopic(selectedTopic);
    if (isRandomTopic) {
      setIsRandomTopic(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800">创建你的测验</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">
            选择难度
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
          >
            <option>入门 (Pre-HSK 1)</option>
            <option>初级 (HSK 1-2)</option>
            <option>中级 (HSK 3-4)</option>
            <option>中高级 (HSK 5)</option>
            <option>高级 (HSK 6)</option>
            <option>专业级 (Proficient)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="questionType" className="block text-sm font-medium text-slate-700 mb-1">
            题目类型
          </label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition bg-white text-slate-900"
          >
            <option>选择题</option>
            <option>简答题</option>
            <option>混合</option>
          </select>
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
                    输入主题
                </label>
                <div className="flex items-center">
                    <input
                        id="random-topic"
                        type="checkbox"
                        checked={isRandomTopic}
                        onChange={(e) => setIsRandomTopic(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="random-topic" className="ml-2 block text-sm text-slate-600">
                        随机主题
                    </label>
                </div>
            </div>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：环保、北京的交通"
            disabled={isRandomTopic}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed bg-white text-slate-900"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-slate-700">
              或选择一个主题
            </label>
             <button
              type="button"
              onClick={refreshTopics}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="刷新主题"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayedTopics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTopicButtonClick(item)}
                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-full hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-700 mb-1">
            问题数量 ({numQuestions})
          </label>
          <input
            type="range"
            id="numQuestions"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || (!isRandomTopic && !topic.trim())}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : (
            '生成试题'
          )}
        </button>
      </form>
    </div>
  );
};