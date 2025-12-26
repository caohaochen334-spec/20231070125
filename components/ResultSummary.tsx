
import React from 'react';
import { QuizResult } from '../types';

interface ResultSummaryProps {
  result: QuizResult;
  onRestart: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, onRestart }) => {
  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  
  let feedback = "继续加油！熟能生巧。";
  let color = "text-yellow-600";
  if (percentage >= 90) { 
    feedback = "太棒了！你已经完全掌握了。"; 
    color = "text-green-600";
  } else if (percentage >= 70) {
    feedback = "做得不错！表现非常稳健。";
    color = "text-blue-600";
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 text-center animate-in zoom-in-95 duration-500">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-6 relative">
            <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin opacity-20"></div>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">练习完成!</h2>
        <p className={`text-xl font-medium ${color}`}>{feedback}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-gray-50 p-6 rounded-2xl">
          <div className="text-3xl font-black text-gray-900">{result.correctAnswers}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">正确题数</div>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <div className="text-3xl font-black text-gray-900">{result.totalQuestions}</div>
          <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">总题目数</div>
        </div>
      </div>

      <div className="mb-10 text-left bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-blue-900">正确率</span>
            <span className="text-2xl font-black text-blue-600">{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:translate-y-0"
      >
        上传新文档并重练
      </button>
    </div>
  );
};

export default ResultSummary;
