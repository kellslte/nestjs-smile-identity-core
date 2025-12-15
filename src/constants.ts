export const SMILE_IDENTITY_MODULE_OPTIONS = 'SMILE_IDENTITY_MODULE_OPTIONS';

export const SMILE_IDENTITY_API_BASE_URL = 'https://api.smileidentity.com/v1';

export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_RETRIES = 3;
export const DEFAULT_RETRY_DELAY = 1000;
export const DEFAULT_MAX_RETRY_DELAY = 10000;

export const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
export const RETRYABLE_ERROR_MESSAGES = [
  'timeout',
  'network',
  'connection',
  'server error',
  'gateway',
  'service unavailable',
];

