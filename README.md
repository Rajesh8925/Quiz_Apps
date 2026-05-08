# AI Quiz App

A modern, AI-powered quiz application built with Django REST API backend and Next.js frontend.

## ⚠️ Important Security Notice

- **API Keys**: You must get your own OpenRouter API key from https://openrouter.ai/keys
- **Database**: Use your own database credentials or SQLite for local development


**For Production:**
- Use environment variables for all sensitive data
- Create your own database and API credentials
- Follow security best practices for credential management

## Features

- **AI-Powered Quiz Generation**: Generate quizzes on any topic using OpenRouter AI API
- **Modern UI**: Beautiful, responsive interface with gradient designs and smooth animations
- **Real-time Scoring**: Instant quiz evaluation and detailed results
- **User Authentication**: Secure token-based authentication system
- **Quiz History**: Track all quiz attempts and review answers
- **Database**: PostgreSQL for robust data storage
- **RESTful API**: Clean, well-structured backend API

## Architecture

### Backend (Django)
- **Framework**: Django 6.0.5 with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Token-based authentication
- **AI Integration**: OpenRouter AI API for quiz generation
- **API Endpoints**:
  - `/api/auth/` - User registration, login, logout
  - `/api/quizzes/` - Quiz CRUD, generation, submission, review

## Database Design Decisions

### Data Models

#### User Management
- **User**: Django's built-in User model for authentication
- **UserProfile**: Extended user profile for additional user information

#### Quiz System
- **Quiz**: Main quiz entity with metadata (title, topic, difficulty, question count)
- **Question**: Individual questions linked to a quiz with text and order
- **Answer**: Multiple choice options for each question with correctness flag
- **QuizAttempt**: Records of user quiz attempts with scores and timestamps
- **UserAnswer**: Tracks individual answers within each attempt

### Design Rationale

1. **Normalized Structure**: Separated questions and answers for flexibility and data integrity
2. **Attempt Tracking**: Comprehensive attempt system for analytics and review
3. **Scalable Architecture**: Designed to handle multiple users, quizzes, and attempts
4. **Relationship Integrity**: Foreign key constraints ensure data consistency

### Database Schema
```sql
-- Users
User (id, username, email, first_name, last_name)
UserProfile (id, user_id, created_at, updated_at)

-- Quiz System
Quiz (id, user_id, title, topic, difficulty, num_questions, created_at)
Question (id, quiz_id, text, order)
Answer (id, question_id, text, is_correct, order)
QuizAttempt (id, user_id, quiz_id, score, total_questions, completed_at)
UserAnswer (id, attempt_id, question_id, selected_answer_id, is_correct)
```

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom gradient themes
- **State Management**: React hooks
- **UI Components**: Custom components with Lucide icons
- **Pages**: Create quiz, take quiz, view results, dashboard

## Project Structure

```
ai-quiz-app/
├── backend/              # Django REST API
│   ├── accounts/         # User authentication
│   ├── quizzes/          # Quiz models and logic
│   ├── quiz_api/         # Django settings
│   ├── requirements.txt  # Python dependencies
│   ├── manage.py         # Django management
│   └── start_server.ps1  # Server startup script
├── frontend/             # Next.js frontend
│   ├── app/              # Next.js pages
│   │   ├── create/       # Quiz creation page
│   │   ├── dashboard/    # User dashboard
│   │   ├── quiz/[id]/    # Quiz taking interface
│   │   ├── login/        # User login
│   │   └── register/     # User registration
│   ├── components/       # Reusable React components
│   ├── lib/              # API and auth utilities
│   └── package.json      # Node.js dependencies
└── README.md            
```

## Tech Stack

### Backend
- **Python 3.x** with Django 6.0.5
- **PostgreSQL** database with psycopg2
- **Django REST Framework** for API
- **Google Gemini API** for AI quiz generation
- **Token Authentication** for secure access

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hooks** for state management
- **Axios/Fetch** for API communication

## How to Run the Project Locally

### Prerequisites
- **Python 3.8+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 12+** - Database (or SQLite for development)
- **OpenRouter API Key** - AI quiz generation

### Step 1: Clone and Setup Repository
```bash
git clone https://github.com/Rajesh8925/Quiz_Apps.git
cd ai-quiz-app
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

#### 2.2 Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables
Create a `.env` file in the backend directory:
```bash
# Database Configuration (SQLite for local development)
# DATABASE_URL=sqlite:///db.sqlite3

# Or PostgreSQL (if you have PostgreSQL installed)
# DATABASE_URL=postgresql://username:password@localhost:5432/quiz_db

# ⚠️ IMPORTANT: Use your own database!
# - For local development, SQLite is recommended (no setup needed)
# - For production, create your own PostgreSQL database

# AI API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Other API keys (for fallbacks)
# GEMINI_API_KEY=your_gemini_api_key
# OPENAI_API_KEY=your_openai_api_key

# ⚠️ IMPORTANT: Get your own API keys!
# - OpenRouter: https://openrouter.ai/keys
# - You need your own API keys for the application to work

# Security
SECRET_KEY=your-secret-key-here (use the default for development)
DEBUG=True
```

#### 2.4 Database Setup and Migrations
```bash
# Create initial migrations
python manage.py makemigrations

# Apply migrations to create database tables
python manage.py migrate

# Create a superuser for admin access (optional)
python manage.py createsuperuser
```

#### 2.5 Start Backend Server
```bash
python manage.py runserver 
# or ./start_server.bat
python manage.py runserver 0.0.0.0:8000
```
The backend will be available at: `http://localhost:8000`

### Step 3: Frontend Setup

#### 3.1 Install Node.js Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Configure Frontend Environment
Create a `.env.local` file in the frontend directory:
```bash
# Local development
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Or for deployed backend:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

#### 3.3 Start Frontend Development Server
```bash
npm run dev
```
The frontend will be available at: `http://localhost:3000`

### Step 4: Test the Complete Application

#### 4.1 Registration and Login
1. Navigate to `http://localhost:3000`
2. Click "Sign In" → "Register" 
3. Create a new account
4. Login with your credentials

#### 4.2 Quiz Generation
1. Click "Get Started" (should redirect to quiz creation if logged in)
2. Fill in quiz details:
   - Topic: e.g., "JavaScript", "World History", "Biology"
   - Number of questions: 5, 10, 15, or 20
   - Difficulty: Easy, Medium, or Hard
3. Click "Generate Quiz"
4. Wait for AI to generate questions (30-60 seconds)

#### 4.3 Take Quiz
1. Answer questions by clicking options
2. Submit quiz when complete
3. View results and detailed review

### Step 5: Verify API Endpoints
Test the backend API directly:

```bash
# Test registration
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123","password_confirm":"TestPass123"}'

# Test login (after registration)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'

# Test quiz generation (with authentication token)
curl -X POST http://localhost:8000/api/quizzes/generate/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript","num_questions":5,"difficulty":"medium"}'
```

### Troubleshooting Common Issues

#### Backend Issues
- **Port 8000 in use**: Change port with `python manage.py runserver 8001`
- **Database errors**: Ensure PostgreSQL is running or use SQLite for development
- **API key errors**: Verify OpenRouter API key in `.env` file
- **Migration errors**: Delete `db.sqlite3` and re-run migrations

#### Frontend Issues
- **Port 3000 in use**: Stop other processes or use `npm run dev -- -p 3001`
- **API connection errors**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- **Build errors**: Run `npm install` to update dependencies
- **CORS errors**: Ensure backend CORS settings include `http://localhost:3000`

#### Authentication Issues
- **Registration 404**: Check backend server is running
- **Login failures**: Verify user exists and credentials are correct
- **Token errors**: Clear browser localStorage and re-login

### Development Tips

#### Backend Development
- Use `python manage.py shell` for database debugging
- Check `python manage.py dbshell` for direct database access
- Monitor `python manage.py runserver` output for errors

#### Frontend Development
- Use browser DevTools for API debugging
- Check Network tab for failed requests
- Monitor Console for JavaScript errors

#### API Testing
- Use Postman or Insomnia for API testing
- Test with curl commands for quick verification
- Check Django admin at `http://localhost:8000/admin`

## Configuration

### Environment Variables (.env)
```bash
# Backend Configuration
DB_NAME=quiz_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
GEMINI_API_KEY=your_gemini_api_key

# Frontend Configuration (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Structure

### Authentication API
**Base URL**: `/api/auth/`

#### Endpoints:
- `POST /api/auth/register/` - User registration
  - **Request**: `{username, email, password, password_confirm}`
  - **Response**: `{user, token}`
  - **Status**: 201 Created

- `POST /api/auth/login/` - User login
  - **Request**: `{username, password}`
  - **Response**: `{user, token}`
  - **Status**: 200 OK

- `POST /api/auth/logout/` - User logout
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `{message}`
  - **Status**: 200 OK

- `GET /api/auth/profile/` - User profile
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `{id, username, email, first_name, last_name}`
  - **Status**: 200 OK

### Quiz API
**Base URL**: `/api/quizzes/`

#### Endpoints:
- `POST /api/quizzes/generate/` - Generate AI quiz
  - **Headers**: `Authorization: Token <token>`
  - **Request**: `{topic, num_questions, difficulty}`
  - **Response**: `{id, title, topic, difficulty, num_questions, questions}`
  - **Status**: 201 Created

- `GET /api/quizzes/` - List user quizzes
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `[{id, title, topic, difficulty, created_at}]`
  - **Status**: 200 OK

- `GET /api/quizzes/{id}/` - Get quiz details (without answers)
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `{id, title, topic, difficulty, questions}`
  - **Status**: 200 OK

- `POST /api/quizzes/{id}/submit/` - Submit quiz answers
  - **Headers**: `Authorization: Token <token>`
  - **Request**: `{answers: [{question_id, answer_id}]}`
  - **Response**: `{attempt_id, score, total, percentage}`
  - **Status**: 200 OK

- `GET /api/quizzes/{id}/review/` - Get quiz with correct answers
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `{id, title, questions: [{text, answers: [{text, is_correct}]}]}`
  - **Status**: 200 OK

- `GET /api/quizzes/attempts/` - List quiz attempts
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `[{id, quiz_title, score, percentage, completed_at}]`
  - **Status**: 200 OK

- `GET /api/quizzes/attempts/{id}/` - Get attempt details
  - **Headers**: `Authorization: Token <token>`
  - **Response**: `{id, quiz, score, user_answers}`
  - **Status**: 200 OK

### API Design Principles
1. **RESTful Architecture**: Clean, resource-based endpoints
2. **Token Authentication**: Secure API access
3. **Consistent Responses**: Standardized JSON format
4. **Error Handling**: Proper HTTP status codes and error messages
5. **CORS Enabled**: Cross-origin requests supported

## UI Features

### Modern Design Elements
- **Gradient Backgrounds**: Soft indigo to violet gradients
- **Card-Based Layout**: Clean, modern interface
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Hover effects and transitions
- **Icon Integration**: Lucide icons throughout
- **Color-Coded Feedback**: Visual scoring indicators

### User Experience
- **Progress Tracking**: Real-time quiz progress
- **Answer Validation**: Instant feedback on selection
- **Results Analytics**: Detailed scoring and statistics
- **Error Handling**: User-friendly error messages
- **Loading States**: Skeleton loaders and spinners
- **Safe Navigation**: Back button with progress protection
- **Exit Confirmation**: Prevents accidental quiz abandonment

## Challenges Faced and Solutions

### 1. Registration 404 Error
**Problem**: Users couldn't register due to 404 errors on OPTIONS requests
**Root Cause**: URL mismatch between frontend and backend deployment URLs
**Solution**: 
- Updated frontend API URL to match deployed backend URL
- Added correct URLs to CORS_ALLOWED_ORIGINS and ALLOWED_HOSTS
- Implemented proper CORS preflight handling

### 2. Authentication Flow Issues
**Problem**: "Get Started" button led to quiz creation page without authentication
**Solution**:
- Added authentication checks in quiz creation page
- Implemented automatic redirect to login for unauthenticated users
- Added loading states and smooth transitions

### 3. AI Quiz Generation Failures
**Problem**: OpenRouter API integration was incorrectly configured
**Issues Found**:
- Wrong API URL format (using Gemini's structure instead of OpenRouter's)
- Incorrect error messages referencing wrong API service
- Wrong response parsing for OpenRouter's JSON format
**Solution**:
- Fixed OpenRouter client to use correct API endpoints and request format
- Updated error messages to reference correct service
- Implemented proper fallback chain (OpenRouter → Gemini → OpenAI)
- Added comprehensive error handling with user-friendly messages

### 4. CORS Configuration Issues
**Problem**: Cross-origin requests blocked in production
**Solution**:
- Added proper CORS middleware configuration
- Configured allowed origins for development and production
- Enabled credentials for authenticated requests

### 5. Frontend State Management
**Problem**: Variable naming conflicts and loading state issues
**Solution**:
- Renamed conflicting variables (loading → submitting)
- Implemented proper loading states for different operations
- Added timeout protection for API requests

### 6. Quiz Navigation Issues
**Problem**: Users couldn't exit quiz taking page without completing
**Solution**:
- Added back button in quiz header for easy navigation
- Implemented confirmation dialog when user has answered questions
- Protected user progress while allowing safe exit
- Improved overall user experience with intuitive navigation

## Features Implemented vs. Skipped

### ✅ Implemented Features
1. **User Authentication System**
   - Registration with email validation
   - Token-based login/logout
   - User profile management

2. **AI Quiz Generation**
   - OpenRouter API integration
   - Customizable topics and difficulty levels
   - Multiple question count options

3. **Quiz Taking Interface**
   - Interactive quiz interface with progress tracking
   - Real-time answer selection
   - Score calculation and results display
   - Back button with progress protection
   - Confirmation dialog for safe quiz exit

4. **Quiz History and Analytics**
   - Attempt tracking and history
   - Detailed quiz review with correct answers
   - Performance analytics

5. **Modern UI/UX**
   - Responsive design with Tailwind CSS
   - Smooth animations and transitions
   - Error handling and loading states

### 🔄 Features Not Implemented (and Why)

1. **Social Sharing**
   - **Reason**: Focus on core functionality first
   - **Future**: Could be added for viral growth

2. **Quiz Categories/Tags**
   - **Reason**: Topic-based generation sufficient for MVP
   - **Future**: Better organization for large quiz libraries

3. **Timer Functionality**
   - **Reason**: Emphasis on learning over speed
   - **Future**: Optional timed quiz mode

4. **Multiplayer Quizzes**
   - **Reason**: Complexity beyond current scope
   - **Future**: Competitive features

5. **Quiz Export/Import**
   - **Reason**: Internal storage adequate
   - **Future**: Content portability

6. **Advanced Analytics Dashboard**
   - **Reason**: Basic history sufficient for MVP
   - **Future**: Detailed learning insights

## Development Workflow

### Git Workflow
1. **Feature Branches**: Create branches for new features
2. **Commit Messages**: Clear, descriptive commit messages
3. **Pull Requests**: Review code before merging
4. **Testing**: Test both frontend and backend
5. **Deployment**: Deploy to staging/production

### Code Quality
- **TypeScript**: Full type safety in frontend
- **ESLint**: Code linting and formatting
- **Django Best Practices**: Clean, maintainable code
- **API Documentation**: Clear endpoint documentation

## Deployment

### Production Deployment
- **Backend**: Gunicorn/Apache or similar WSGI server
- **Frontend**: Vercel, Netlify, or similar platform
- **Database**: PostgreSQL cloud service
- **Environment**: Production environment variables

### Environment Setup
```bash
# Production
DEBUG=False
ALLOWED_HOSTS=['yourdomain.com']
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
6. Follow the coding standards


## Acknowledgments

- **Google Gemini AI or OpenRouter** for quiz generation capabilities
- **Django Team** for excellent web framework
- **Next.js Team** for React framework
- **Tailwind CSS** for utility-first CSS framework
- **Lucide** for beautiful icon library

---



