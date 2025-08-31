// Use relative URL to leverage Vite's proxy in development
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:4000')
  : '/api';

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
    credentials: 'include',
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      // If response is not JSON, fallback to text
      data = await response.text();
    }

    if (!response.ok) {
      // Log error details for debugging
      console.error('API error:', {
        url,
        status: response.status,
        data,
      });
      throw new APIError(
        (data && data.error) || (typeof data === 'string' ? data : 'Request failed'),
        response.status,
        data.details || data
      );
    }

    // Log successful response for debugging
    console.log('API success:', { url, data });
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    // Log network error for debugging
    console.error('Network error:', error);
    throw new APIError('Network error', 0, error.message);
  }
}

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  verifyEmail: async (email, otp) => {
    return await apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resendOtp: async (email) => {
    // Assuming you have this endpoint
    return await apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
};

// User API functions
export const userAPI = {
  getProfile: async () => {
    return await apiRequest('/users/me');
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
};

// Auth helpers
export const authHelpers = {
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export { APIError };