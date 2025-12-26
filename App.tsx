
import React, { useState } from 'react';
import { AppState, Question } from './types';
import FileUploader from './components/FileUploader';
import QuizCard from './components/QuizCard';
import ResultSummary from './components/ResultSummary';
import { parseQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [parsingStatus, setParsingStatus] = useState("正在上传并解析文件...");

  const handleDataReady = async (text?: string, fileData?: { base64: string, mimeType: string }) => {
    setIsLoading(true);
    setState(AppState.PARSING);
    setParsingStatus("AI 正在分析文档内容并生成互动题目...");
    
    try {
      const parsedQuestions = await parseQuestions(text, fileData);
      if (parsedQuestions.length === 0) {
        throw new Error("未能从文档中识别到有效的题目。");
      }
      setQuestions(parsedQuestions);
      setScore(0);
      setCurrentIndex(0);
      setState(AppState.QUIZ);
    } catch (error) {
      alert(error instanceof Error ? error.message : "整理失败，请检查文件格式。");
      setState(AppState.UPLOAD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setState(AppState.SUMMARY);
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setState(AppState.UPLOAD);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          智能<span className="text-blue-600">刷题</span>助手
        </h1>
        <p className="text-gray-500 mt-2 font-medium tracking-wide">支持 Word/PDF，让学习更简单</p>
      </header>

      <main className="w-full flex justify-center">
        {state === AppState.UPLOAD && (
          <FileUploader onDataReady={handleDataReady} isLoading={isLoading} />
        )}

        {state === AppState.PARSING && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 正在深度处理...</h2>
            <p className="text-gray-500 max-w-xs">{parsingStatus}</p>
          </div>
        )}

        {state === AppState.QUIZ && questions.length > 0 && (
          <QuizCard 
            question={questions[currentIndex]} 
            currentIndex={currentIndex} 
            totalQuestions={questions.length} 
            onAnswer={handleAnswer}
            autoNext={true}
          />
        )}

        {state === AppState.SUMMARY && (
          <ResultSummary 
            result={{
              totalQuestions: questions.length,
              correctAnswers: score,
              incorrectQuestions: [] 
            }} 
            onRestart={resetQuiz} 
          />
        )}
      </main>

      <footer className="mt-auto py-8 text-gray-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} 智能刷题助手. 推荐使用 .docx 或 .pdf 格式.
      </footer>
    </div>
  );
};

export default App;
