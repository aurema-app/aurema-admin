import { auth } from './firebase';

export type ApiEnvironment = 'prod' | 'staging';

const API_ENV_STORAGE_KEY = 'aurema-api-env';
const DEFAULT_API_ENV = process.env.NEXT_PUBLIC_DEFAULT_API_ENV;

const API_URLS: Record<ApiEnvironment, string | undefined> = {
  prod: process.env.NEXT_PUBLIC_API_URL_PROD || process.env.NEXT_PUBLIC_API_URL,
  staging:
    process.env.NEXT_PUBLIC_API_URL_STAGING || process.env.NEXT_PUBLIC_API_URL,
};

function isValidApiEnvironment(value: string | null): value is ApiEnvironment {
  return value === 'prod' || value === 'staging';
}

export function getApiEnvironment(): ApiEnvironment {
  if (typeof window !== 'undefined') {
    const storedValue = window.localStorage.getItem(API_ENV_STORAGE_KEY);

    if (isValidApiEnvironment(storedValue)) {
      return storedValue;
    }
  }

  if (DEFAULT_API_ENV === 'staging') {
    return 'staging';
  }

  return 'prod';
}

export function setApiEnvironment(environment: ApiEnvironment): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(API_ENV_STORAGE_KEY, environment);
  }
}

export function getApiBaseUrl(environment = getApiEnvironment()): string {
  const preferredUrl = API_URLS[environment];

  if (preferredUrl) {
    return preferredUrl;
  }

  return API_URLS.prod || API_URLS.staging || '';
}

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
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new ApiError('API base URL is not configured', 500);
  }

  // Wait for auth to be ready and get token
  if (!auth.currentUser) {
    throw new ApiError('Not authenticated', 401);
  }

  const token = await auth.currentUser.getIdToken();

  if (!token) {
    throw new ApiError('Failed to get authentication token', 401);
  }

  const res = await fetch(`${apiBaseUrl}${endpoint}`, {
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
