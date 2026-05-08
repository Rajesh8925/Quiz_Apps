'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Trophy } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  order: number;
  answers: { id: string; text: string; order: number; is_correct: boolean }[];
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
}

interface UserAnswer {
  question_text: string;
  selected_answer_text: string;
  correct_answer_text: string;
  is_correct: boolean;
}

interface Attempt {
  id: string;
  quiz_title: string;
  quiz_topic: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
  user_answers: UserAnswer[];
}

export default function QuizReviewPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizReview();
  }, [params.id]);

  async function loadQuizReview() {
    try {
      // Get quiz data with correct answers
      const quizData = await quizApi.getQuizReview(params.id as string);
      setQuiz(quizData);
      
      // Get user's latest attempt for this quiz
      try {
        const attempts = await quizApi.getAttempts();
        const latestAttempt = attempts.find((a: Attempt) => a.quiz_title === quizData.title);
        
        if (latestAttempt) {
          const attemptDetail = await quizApi.getAttempt(latestAttempt.id);
          setAttempt(attemptDetail);
        }
      } catch (attemptErr) {
        console.warn('Could not load attempt data:', attemptErr);
        // Continue without attempt data - show quiz with correct answers only
      }
    } catch (err: any) {
      console.error('Failed to load quiz review:', err);
      if (err.status === 404) {
        setError('Quiz not found. It may have been deleted or you may not have access to it.');
      } else {
        setError('Failed to load quiz review. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleBack = () => {
    router.push(`/quiz/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading quiz review...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Quiz review not found'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use attempt data if available, otherwise show no score
  const scoreData = attempt ? {
    correct: attempt.score,
    total: attempt.total_questions,
    percentage: attempt.percentage
  } : {
    correct: 0,
    total: quiz?.questions.length || 0,
    percentage: 0
  };

  const { correct, total, percentage } = scoreData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-600">Quiz Review</p>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className={`w-24 h-24 ${percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Trophy className={`w-12 h-12 ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-gray-600 mb-8">Here's how you performed:</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              {attempt ? (
                <>
                  <div className={`text-7xl font-extrabold ${percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'} mb-2`}>
                    {percentage.toFixed(1)}%
                  </div>
                  <p className="text-lg text-gray-600">
                    You got <span className="font-bold text-gray-900">{correct}</span> out of <span className="font-bold text-gray-900">{total}</span> questions correct
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">No attempt data found</p>
                  <p className="text-sm text-gray-500">Complete the quiz first to see your results here</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          {attempt ? (
            // Show user answers from attempt data
            attempt.user_answers.map((userAnswer, qIndex) => (
              <div key={qIndex} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{qIndex + 1}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-relaxed flex-1">{userAnswer.question_text}</h2>
                  {userAnswer.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg border-2 ${
                    userAnswer.is_correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">Your answer:</span>
                      <span className={`flex-1 ${
                        userAnswer.is_correct
                          ? 'text-green-800 font-medium'
                          : 'text-red-800 font-medium'
                      }`}>
                        {userAnswer.selected_answer_text}
                      </span>
                    </div>
                  </div>
                  
                  {!userAnswer.is_correct && (
                    <div className="p-4 rounded-lg border-2 border-green-500 bg-green-50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Correct answer:</span>
                        <span className="flex-1 text-green-800 font-medium">
                          {userAnswer.correct_answer_text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Show quiz with correct answers if no attempt data
            quiz.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{qIndex + 1}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-relaxed flex-1">{question.text}</h2>
                </div>
                
                <div className="space-y-3">
                  {question.answers.map((answer, aIndex) => (
                    <div
                      key={answer.id}
                      className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                        answer.is_correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
                        answer.is_correct
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + aIndex)}
                      </div>
                      <span className={`flex-1 ${
                        answer.is_correct
                          ? 'text-green-800 font-medium'
                          : 'text-gray-800'
                      }`}>
                        {answer.text}
                      </span>
                      {answer.is_correct && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
