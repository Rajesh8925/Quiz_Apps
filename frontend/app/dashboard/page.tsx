'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Loader2, Plus, BookOpen, Trophy, Clock, TrendingUp, Target, Award } from 'lucide-react';
import Navbar from '@/components/navbar';

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  num_questions: number;
  created_at: string;
}

interface Attempt {
  id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuizzes, setShowQuizzes] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
    
    // Check if URL hash is #quizzes and expand the section
    if (window.location.hash === '#quizzes') {
      setShowQuizzes(true);
    }
  }, [token]);

  async function loadData() {
    try {
      const [quizzesData, attemptsData] = await Promise.all([
        quizApi.getQuizzes(),
        quizApi.getAttempts()
      ]);
      setQuizzes(quizzesData);
      setAttempts(attemptsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalQuizzes = quizzes.length;
  const totalAttempts = attempts.length;
  const averageScore = attempts.length > 0 
    ? attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length 
    : 0;
  const bestScore = attempts.length > 0 
    ? Math.max(...attempts.map(a => a.percentage)) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">Ready to test your knowledge with AI-powered quizzes?</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{bestScore.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Quiz Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Create New Quiz</h2>
              </div>
              <p className="text-gray-600 mb-6">Generate a new AI-powered quiz on any topic you choose.</p>
              <button
                onClick={() => router.push('/create')}
                className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                Create Quiz
              </button>
            </div>
          </div>

          {/* Your Quizzes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowQuizzes(!showQuizzes)}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Quizzes</h2>
                  <span className="text-sm text-gray-500">({quizzes.length} quizzes)</span>
                </div>
                <div className={`transition-transform duration-200 ${showQuizzes ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Collapsible Quiz List */}
              {showQuizzes && (
                <div className="mt-6">
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No quizzes created yet. Create your first quiz to get started!</p>
                      <button
                        onClick={() => router.push('/create')}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Create Your First Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
                          onClick={() => router.push(`/quiz/${quiz.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                              <p className="text-sm text-gray-600">{quiz.topic} • {quiz.difficulty} • {quiz.num_questions} questions</p>
                              <p className="text-xs text-gray-500">Created {new Date(quiz.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <button className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                                Start Quiz
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
