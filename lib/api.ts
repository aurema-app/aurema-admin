import { auth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Wait for auth to be ready and get token
  if (!auth.currentUser) {
    throw new ApiError('Not authenticated', 401);
  }

  const token = await auth.currentUser.getIdToken();

  if (!token) {
    throw new ApiError('Failed to get authentication token', 401);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new ApiError(
      errorData?.message || errorData?.error || `API error: ${res.status}`,
      res.status,
      errorData
    );
  }

  return res.json();
}
