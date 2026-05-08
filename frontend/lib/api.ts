const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

async function handleResponse(response: Response) {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    let errorData: unknown;
    let errorText: string;
    
    try {
      errorText = await response.text();
      console.log('Raw error response:', errorText);
      console.log('Error response length:', errorText.length);
      
      if (errorText.trim() === '') {
        console.log('Empty error response detected');
        errorData = `Server returned ${response.status} ${response.statusText} with no error details`;
      } else {
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          console.log('Failed to parse error as JSON, using raw text');
          errorData = errorText;
        }
      }
    } catch (textError) {
      console.log('Unable to read error response body:', textError);
      errorData = `Server returned ${response.status} ${response.statusText} but response body could not be read`;
    }
    
    const error: ApiError = new Error(`API request failed: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.data = errorData;
    
    console.error('API Error details:', {
      status: error.status,
      data: error.data,
      message: error.message
    });
    
    // Log the actual error data for debugging
    if (typeof error.data === 'object' && error.data !== null) {
      console.log('Error data contents:', JSON.stringify(error.data, null, 2));
    } else {
      console.log('Error data as string:', error.data);
    }
    throw error;
  }
  return response.json();
}

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

function getHeaders() {
  const token = getToken();
  console.log('Getting headers with token:', token);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
    console.log('Authorization header:', `Token ${token}`);
  }
  return headers;
}

// Auth API
export const authApi = {
  register: async (data: { username: string; email: string; password: string; password_confirm: string }) => {
    const response = await fetch(`${API_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  login: async (data: { username: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Quiz API
export const quizApi = {
  generateQuiz: async (data: { topic: string; num_questions: number; difficulty: string }) => {
    console.log('Making quiz generation request to:', `${API_URL}/quizzes/generate/`);
    console.log('Request data:', data);
    console.log('Request headers:', getHeaders());
    
    try {
      const response = await fetch(`${API_URL}/quizzes/generate/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      console.log('Response received:', response.status, response.statusText);
      return handleResponse(response);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }
  },

  getQuizzes: async () => {
    const response = await fetch(`${API_URL}/quizzes/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getQuiz: async (id: string) => {
    const response = await fetch(`${API_URL}/quizzes/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  submitQuiz: async (id: string, answers: { question_id: number; answer_id: number }[]) => {
    const url = `${API_URL}/quizzes/${id}/submit/`;
    const headers = getHeaders();
    const body = JSON.stringify({ answers });
    
    console.log('Submitting quiz to:', url);
    console.log('Request headers:', headers);
    console.log('Request body:', body);
    console.log('Answers array:', answers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });
    
    console.log('Response received:', response.status, response.statusText);
    return handleResponse(response);
  },

  getQuizReview: async (id: string) => {
    const response = await fetch(`${API_URL}/quizzes/${id}/review/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAttempts: async () => {
    const response = await fetch(`${API_URL}/quizzes/attempts/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAttempt: async (id: string) => {
    const response = await fetch(`${API_URL}/quizzes/attempts/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
