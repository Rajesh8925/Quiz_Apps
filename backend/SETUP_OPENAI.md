# Setup OpenAI API Key

The application now supports OpenAI as an alternative AI service for quiz generation.

## Steps to Set Up OpenAI API Key

### 1. Get an OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the generated API key

### 2. Configure the API Key
In `backend/.env`, add your OpenAI API key:

```bash
# In backend/.env
OPENAI_API_KEY=your_actual_openai_key_here
```

### 3. Install Dependencies
The OpenAI library is already added to requirements.txt, but install if needed:

```bash
pip install openai>=1.3.0
```

### 4. Restart the Server
After adding the API key, restart the Django server:

```bash
python manage.py runserver
```

## How It Works

- **Primary**: Tries Gemini API first
- **Fallback**: If Gemini fails, automatically tries OpenAI
- **Both Fail**: Shows clear error message to user

## Current Status

The application will automatically try both AI services to ensure quiz generation works even if one service has quota issues.
