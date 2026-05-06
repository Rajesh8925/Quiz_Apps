# AI Quiz App

A modern, AI-powered quiz application built with Django REST API backend and Next.js frontend.

## Features

- **AI-Powered Quiz Generation**: Generate quizzes on any topic using Google's Gemini AI
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
- **AI Integration**: Google Gemini API for quiz generation
- **API Endpoints**:
  - `/api/auth/` - User registration, login, logout
  - `/api/quizzes/` - Quiz CRUD, generation, submission, review

### Frontend (Next.js)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom gradient themes
- **State Management**: React hooks
- **UI Components**: Custom components with Lucide icons
- **Pages**: Create quiz, take quiz, view results, dashboard

## Project Structure

```
ai-quiz-app/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication
│   ├── quizzes/            # Quiz models and logic
│   ├── quiz_api/           # Django settings
│   ├── requirements.txt      # Python dependencies
│   ├── manage.py           # Django management
│   └── start_server.ps1     # Server startup script
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js pages
│   │   ├── create/        # Quiz creation page
│   │   ├── dashboard/     # User dashboard
│   │   ├── quiz/[id]/     # Quiz taking interface
│   │   ├── login/          # User login
│   │   └── register/       # User registration
│   ├── components/         # Reusable React components
│   ├── lib/              # API and auth utilities
│   └── package.json       # Node.js dependencies
└── README.md              # This file
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

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Google Gemini API key

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Rajesh8925/Quiz_App.git
   cd ai-quiz-app
   ```
2. Navigate to backend and create virtual environment:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database and API credentials
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start server:
   ```bash
   python manage.py runserver
   # Or use: .\start_server.ps1
   ```

### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

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

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - User profile

### Quiz Endpoints
- `POST /api/quizzes/generate/` - Generate AI quiz
- `GET /api/quizzes/` - List user quizzes
- `GET /api/quizzes/{id}/` - Get quiz details
- `POST /api/quizzes/{id}/submit/` - Submit quiz answers
- `GET /api/quizzes/{id}/review/` - Get quiz with correct answers
- `GET /api/quizzes/attempts/` - List quiz attempts
- `GET /api/quizzes/attempts/{id}/` - Get attempt details

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

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Google Gemini AI** for quiz generation capabilities
- **Django Team** for excellent web framework
- **Next.js Team** for React framework
- **Tailwind CSS** for utility-first CSS framework
- **Lucide** for beautiful icon library

---


**Built with ❤️ using modern web technologies**
