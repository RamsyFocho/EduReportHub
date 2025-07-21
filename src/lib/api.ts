
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
      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
         if (response.status === 403) {
            errorMessage = errorData.message || "You do not have permission to access this resource.";
        }
      } catch (e) {
        // Ignore if the response is not JSON
      }
      throw new Error(errorMessage);
    }
  
    if (response.status === 204) {
      return;
    }
    
    return response.json();
  } catch(error) {
    console.error("API Request Error:", error);
    if (error instanceof Error) {
        throw error;
    }
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
