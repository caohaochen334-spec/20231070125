
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  autoNext: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, currentIndex, totalQuestions, onAnswer, autoNext }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedIdx(null);
    setIsAnswered(false);
  }, [question]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    
    const correct = idx === question.correctIndex;
    
    if (correct && autoNext) {
      setTimeout(() => {
        onAnswer(true);
      }, 1200);
    } else {
      // If incorrect or not autoNext, wait for manual confirmation or just pass back result
      // But user wants auto-jump only if correct.
      if (!correct) {
         // Maybe user wants to read explanation?
      }
    }
  };

  const handleNextManual = () => {
    onAnswer(selectedIdx === question.correctIndex);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Header */}
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
        <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Question {currentIndex + 1} of {totalQuestions}</span>
        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
          {question.question}
        </h3>

        <div className="space-y-4 mb-8">
          {question.options.map((option, idx) => {
            let bgColor = "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50";
            let textColor = "text-gray-700";
            let borderColor = "border-gray-200";

            if (isAnswered) {
              if (idx === question.correctIndex) {
                bgColor = "bg-green-50 border-green-500";
                textColor = "text-green-800";
                borderColor = "border-green-500";
              } else if (idx === selectedIdx) {
                bgColor = "bg-red-50 border-red-500";
                textColor = "text-red-800";
                borderColor = "border-red-500";
              } else {
                bgColor = "bg-gray-50 border-gray-100 opacity-50";
                textColor = "text-gray-400";
              }
            } else if (selectedIdx === idx) {
              bgColor = "bg-blue-600 border-blue-600";
              textColor = "text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${bgColor} ${borderColor}`}
              >
                <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg mr-4 border text-sm font-bold ${isAnswered ? 'invisible' : 'visible'} ${selectedIdx === idx ? 'bg-blue-500 border-blue-400 text-white' : 'bg-gray-50 border-gray-200 text-gray-400 group-hover:text-blue-500 group-hover:border-blue-200'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`font-medium ${textColor}`}>{option}</span>
                {isAnswered && idx === question.correctIndex && (
                  <svg className="h-6 w-6 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {isAnswered && idx === selectedIdx && idx !== question.correctIndex && (
                  <svg className="h-6 w-6 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 mb-6">
              <h4 className="font-bold text-blue-900 mb-1 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explanation
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
            
            {/* Show manual next button only if it's the wrong answer OR auto-jump is disabled */}
            {(!autoNext || selectedIdx !== question.correctIndex) && (
              <button
                onClick={handleNextManual}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all transform hover:-translate-y-1"
              >
                {currentIndex === totalQuestions - 1 ? "See Results" : "Next Question"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
