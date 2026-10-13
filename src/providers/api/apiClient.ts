/**
 * Base REST API Client for Rowan & Hound Supply Co.
 *
 * This client communicates with the future backend (e.g. Laravel / Node.js / Express / MySQL)
 * through standard REST endpoints.
 */

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(config?.defaultHeaders || {}),
    };
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Strip trailing /api if endpoint already starts with /api
    const url = cleanEndpoint.startsWith('/api') && this.baseUrl.endsWith('/api')
      ? `${this.baseUrl.replace(/\/api$/, '')}${cleanEndpoint}`
      : `${this.baseUrl}${cleanEndpoint}`;

    if (!params) return url;

    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });

    const queryString = query.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, { method: 'DELETE' });
  }

  private async request<T>(url: string, init: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          ...this.defaultHeaders,
          ...(init.headers || {}),
        },
      });

      if (!res.ok) {
        let errorData: any;
        try {
          errorData = await res.json();
        } catch {
          errorData = await res.text();
        }
        throw new ApiError(
          `REST API request to ${init.method || 'GET'} ${url} failed with status ${res.status}`,
          res.status,
          errorData
        );
      }

      return (await res.json()) as T;
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        `Failed to reach backend REST API: ${err?.message || 'Network error'}`,
        503,
        err
      );
    }
  }
}

export const defaultApiClient = new ApiClient();
