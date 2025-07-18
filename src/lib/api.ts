import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');
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
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }
  
    if (response.status === 204) {
      return;
    }
    
    return response.json();
  } catch(error) {
    console.error("Fetch error:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch: ${error.message}`);
    }
    throw new Error('Failed to fetch due to an unknown network error.');
  }

}

export const api = {
  get: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => request(endpoint, { ...options, method: 'DELETE' }),
  postFormData: async (endpoint: string, formData: FormData) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      return response.json();
    } catch(error) {
        console.error("Fetch error (form-data):", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch: ${error.message}`);
        }
        throw new Error('Failed to fetch due to an unknown network error.');
    }
  }
};