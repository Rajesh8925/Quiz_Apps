import { Brain, BookOpen, Target, Zap, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Quiz Generator
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-2xl mx-auto">
              Create engaging quizzes instantly with artificial intelligence. Perfect for educators, students, and trivia enthusiasts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/create"
                className="bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Get Started
                </div>
              </Link>
              <Link 
                href="/login"
                className="border-3 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes quiz creation simple and intuitive. 
              Generate custom questions, set difficulty levels, and share your quizzes in minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600">
                Our intelligent algorithms create relevant questions based on your topics and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Customizable Content
              </h3>
              <p className="text-gray-600">
                Tailor difficulty, topics, and question types to match your specific needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Results
              </h3>
              <p className="text-gray-600">
                Get immediate feedback and detailed analytics to track progress and performance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
