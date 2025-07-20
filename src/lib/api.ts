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
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new ApiError(errorData.message || `HTTP error! status: ${response.status}`, errorData, response.status);
    }
  
    if (response.status === 204) {
      return;
    }
    
    return response.json();
  } catch(error) {
    console.error("Fetch error:", error);
    if (error instanceof ApiError) {
        throw error; // Re-throw the custom error with full details
    }
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
    try {
      return await request(endpoint, { method: 'POST', body: formData });
    } catch(error) {
        console.error("Fetch error (form-data):", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch: ${error.message}`);
        }
        throw new Error('Failed to fetch due to an unknown network error.');
    }
  }
};
