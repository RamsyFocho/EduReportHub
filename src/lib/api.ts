
import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiError extends Error {
  response: any;
  status: number;

  constructor(message: string, response: any, status: number) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.status = status;
  }
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Attempt to parse error response, default to a generic message if parsing fails
      const errorData = await response.json().catch(() => ({ 
          message: `Request failed with status: ${response.status}` 
      }));
      // Throw a structured error with details from the server
      throw new ApiError(errorData.message || 'An unknown error occurred.', errorData, response.status);
    }
  
    // Handle successful responses with no content
    if (response.status === 204) {
      return;
    }
    
    // Handle successful responses with JSON content
    return response.json();
  } catch(error) {
    console.error("API Request Error:", error);
    // Re-throw custom ApiError or create a new generic one
    if (error instanceof ApiError) {
        throw error;
    }
    if (error instanceof Error) {
        throw new Error(`Network request failed: ${error.message}`);
    }
    // Fallback for unexpected errors
    throw new Error('An unknown network error occurred.');
  }
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
  postFormData: (endpoint: string, formData: FormData, options?: RequestInit) => {
    return request(endpoint, { ...options, method: 'POST', body: formData });
  }
};
