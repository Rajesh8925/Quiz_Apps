'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Loader2, Trophy, Clock, BookOpen, ArrowRight, BarChart3 } from 'lucide-react';
import Navbar from '@/components/navbar';

interface Attempt {
  id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export default function HistoryPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadAttempts();
  }, [token]);

  async function loadAttempts() {
    try {
      const data = await quizApi.getAttempts();
      setAttempts(data);
    } catch (error) {
      console.error('Failed to load attempts:', error);
      setError('Failed to load quiz history');
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (percentage: number) => {
    if (percentage >= 70) return 'Pass';
    if (percentage >= 50) return 'Average';
    return 'Fail';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {/* Stats Summary */}
        {attempts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
                  <p className="text-sm text-gray-600">Total Attempts</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attempts.filter(a => a.percentage >= 70).length}
                  </p>
                  <p className="text-sm text-gray-600">Passed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attempts.reduce((sum, a) => sum + a.total_questions, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Questions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {attempts.length > 0 ? 
                      (attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length).toFixed(1) 
                      : '0'
                    }%
                  </p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attempts List */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Quiz Attempts
            </h2>
          </div>
          
          {attempts.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quiz Attempts Yet</h3>
              <p className="text-gray-600 mb-6">You haven't taken any quizzes yet. Start by creating your first quiz!</p>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{attempt.quiz_title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </div>
                        <div>
                          Score: {attempt.score}/{attempt.total_questions}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(attempt.percentage)}`}>
                        {getScoreLabel(attempt.percentage)}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {attempt.percentage.toFixed(1)}%
                      </div>
                      <button
                        onClick={() => router.push(`/quiz/${attempt.id}/review`)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Review
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
