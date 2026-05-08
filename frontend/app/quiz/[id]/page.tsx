'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizApi } from '@/lib/api';
import { Loader2, CheckCircle, XCircle, Clock, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  order: number;
  answers: { id: string; text: string; order: number; is_correct?: boolean }[];
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; attempt_id: string } | null>(null);
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadQuiz();
  }, [params.id]);

  async function loadQuiz() {
    try {
      const data = await quizApi.getQuiz(params.id as string);
      console.log('Quiz data loaded:', data);
      console.log('First question answers:', data.questions[0]?.answers);
      setQuiz(data);
    } catch (err: any) {
      console.error('Failed to load quiz:', err);
      if (err.status === 404) {
        setError('Quiz not found. It may have been deleted or you may not have access to it.');
      } else {
        setError('Failed to load quiz. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      if (!confirm(`You've answered ${answeredCount} out of ${quiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([questionId, answerId]) => ({
        question_id: parseInt(questionId),
        answer_id: parseInt(answerId),
      }));
      console.log('Submitting quiz with answers:', answerArray);
      const data = await quizApi.submitQuiz(params.id as string, answerArray);
      console.log('Quiz submission response:', data);
      setResult(data);
    } catch (err: unknown) {
      console.error('Quiz submission error:', err);
      const error = err as { data?: any; status?: number; message?: string };
      
      let errorMessage = 'Failed to submit quiz';
      if (error.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.error) {
          errorMessage = error.data.error;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else {
          errorMessage = JSON.stringify(error.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Quiz not found'}</p>
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

  if (result) {
    const isPassing = result.percentage >= 70;
    const isMedium = result.percentage >= 50 && result.percentage < 70;
    const scoreColor = isPassing ? 'text-green-600' : isMedium ? 'text-yellow-600' : 'text-red-600';
    const scoreBg = isPassing ? 'bg-green-100' : isMedium ? 'bg-yellow-100' : 'bg-red-100';
    
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className={`w-24 h-24 ${scoreBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <Trophy className={`w-12 h-12 ${scoreColor}`} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-gray-600 mb-8">Great job finishing the quiz. Here&apos;s how you performed:</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className={`text-7xl font-extrabold ${scoreColor} mb-2`}>
                {result.percentage.toFixed(1)}%
              </div>
              <p className="text-lg text-gray-600">
                You got <span className="font-bold text-gray-900">{result.score}</span> out of <span className="font-bold text-gray-900">{result.total}</span> questions correct
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => router.push(`/quiz/${params.id}/review`)}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Review Answers
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question <span className="text-indigo-600 font-bold">{currentQuestion + 1}</span> of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-600">{currentQuestion + 1}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">{question.text}</h2>
          </div>
          
          <div className="space-y-3">
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(question.id, answer.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[question.id] === answer.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
                    answers[question.id] === answer.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + answer.order - 1)}
                  </span>
                  <span className="text-gray-800 font-medium">{answer.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quiz'
              )}
            </button>
        )}
      </div>
      </div>
    </div>
  );
}
