# Setup Gemini API Key

## Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in and click "Create API Key"
3. Copy the key

## Configure
In `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

## Restart Server
Stop and restart Django server after adding the key.

## Current Status
Using fallback questions until API key is configured.
