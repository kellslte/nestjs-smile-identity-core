export interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface HttpResponse<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
}

export interface HttpError {
  status: number;
  statusText: string;
  message: string;
  data?: any;
}

export interface RetryOptions {
  retries: number;
  retryDelay: number;
  maxRetryDelay: number;
  shouldRetry?: (error: HttpError) => boolean;
}

