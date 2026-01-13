import { auth } from '~/firebase/config';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(forceRefresh);
  } catch {
    return null;
  }
};

export const getAuthHeaders = async (
  forceRefresh = false,
): Promise<HeadersInit> => {
  const token = await getAuthToken(forceRefresh);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retryOn401 = true,
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && retryOn401) {
      const refreshedHeaders = await getAuthHeaders();
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...refreshedHeaders,
          ...options.headers,
        },
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({
          error: 'Unauthorized',
          message: 'Authentication failed. Please sign in again.',
        }));
        throw new Error(error.message || error.error || 'Request failed');
      }

      return retryResponse.json();
    }

    const error = await response.json().catch(() => ({
      error: 'Unknown error',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));

    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
};

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
