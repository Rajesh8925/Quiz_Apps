# AI-Powered Quiz Application

A full-stack quiz application where users can generate AI-powered quizzes, take them, and track their performance.

## Features

- **User Authentication**: Register, login, and session management
- **AI Quiz Generation**: Create quizzes on any topic using Google's Gemini AI
- **Quiz Taking**: Interactive quiz interface with progress tracking
- **Results & Analytics**: View scores, percentage, and detailed review
- **Quiz History**: Track all past attempts with detailed breakdowns
- **Responsive Design**: Modern UI that works on desktop and mobile

## Tech Stack

### Backend
- **Django**: Web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **Google Gemini AI**: Quiz question generation

### Frontend
- **Next.js**: React framework with TypeScript
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Project Structure

```
ai-quiz-app/
├── backend/
│   ├── quiz_api/          # Django project settings
│   ├── accounts/           # User authentication
│   ├── quizzes/            # Quiz models and API
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/                # Next.js app router
    ├── components/         # React components
    ├── lib/                # API utilities and auth context
    └── next.config.ts
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE quiz_db;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE quiz_db TO postgres;
```

2. Set up Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Create `.env` file:
```env
DB_NAME=quiz_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
GEMINI_API_KEY=your_gemini_api_key
```

4. Run migrations and start server:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
python manage.py runserver
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Start development server:
```bash
npm run dev
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/profile/` - Get user profile

### Quizzes
- `POST /api/quizzes/generate/` - Generate AI quiz
- `GET /api/quizzes/` - List user's quizzes
- `GET /api/quizzes/{id}/` - Get quiz details
- `POST /api/quizzes/{id}/submit/` - Submit quiz answers
- `GET /api/quizzes/{id}/review/` - Get quiz with correct answers
- `GET /api/quizzes/attempts/` - List quiz attempts
- `GET /api/quizzes/attempts/{id}/` - Get attempt details

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Quiz**: Go to "Create Quiz" and enter a topic, number of questions (5-20), and difficulty level
3. **Take Quiz**: Click "Take" on any quiz in your dashboard
4. **View Results**: After submitting, see your score and percentage
5. **Review**: View correct answers for any quiz
6. **History**: Track all your past attempts with detailed analytics

## License

MIT License
