'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { quizApi } from '@/lib/api';
import { Loader2, Brain, BookOpen, Zap } from 'lucide-react';
import Navbar from '@/components/navbar';

export default function CreateQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    topic: '',
    num_questions: 5,
    difficulty: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    console.log('Starting quiz creation with data:', formData);

    try {
      console.log('Calling quizApi.generateQuiz...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - please try again')), 30000);
      });
      
      const quizPromise = quizApi.generateQuiz(formData);
      const result = await Promise.race([quizPromise, timeoutPromise]);
      
      console.log('Quiz generation successful, redirecting to quiz...', result);
      router.push(`/quiz/${result.id}`);
    } catch (err: unknown) {
      console.error('Create quiz error:', err);
      const error = err as { data?: Record<string, string[]> | string | any };
      let errorMessage = 'Failed to generate quiz';
      
      if (typeof error.data === 'string' && error.data.trim()) {
        errorMessage = error.data;
      } else if (error.data && typeof error.data === 'object') {
        if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.data.error) {
          errorMessage = error.data.error;
        } else {
          const errorValues = Object.values(error.data).flat();
          if (errorValues.length > 0) {
            errorMessage = errorValues.join(', ');
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = 'API quota exceeded. Please try again later or check your billing.';
      } else if (errorMessage.includes('Invalid token') || errorMessage.includes('401')) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (errorMessage.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
          </div>
          
          <p className="text-gray-600 mb-8">
            Use AI to generate a custom quiz on any topic. Choose your preferences below and let our AI create engaging questions for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Topic
              </label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                value={formData.topic}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., World History, JavaScript, Biology"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="num_questions" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  id="num_questions"
                  name="num_questions"
                  value={formData.num_questions}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 mb-6">
              <Zap className="w-4 h-4 text-indigo-600" />
              <span>AI will generate multiple-choice questions with 4 options each</span>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
