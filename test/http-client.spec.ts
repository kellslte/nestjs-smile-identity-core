import { HttpClient } from '../src/http-client';
import { SmileIdentityError } from '../src/errors/smile-identity.error';

// Mock fetch globally
global.fetch = jest.fn();
global.AbortController = jest.fn().mockImplementation(() => ({
  signal: 'test-signal',
  abort: jest.fn(),
}));

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(httpClient).toBeDefined();
  });

  describe('request', () => {
    const mockOptions = {
      method: 'GET' as const,
      url: 'https://api.smileidentity.com/v1/test',
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    };

    const mockRetryOptions = {
      retries: 2,
      retryDelay: 1000,
      maxRetryDelay: 5000,
    };

    it('should make a successful request on first attempt', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ success: true }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await httpClient.request(mockOptions, mockRetryOptions);

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      jest.useRealTimers(); // Use real timers for this test
      
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ error: 'Server error' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(httpClient.request(mockOptions, mockRetryOptions)).rejects.toThrow(
        SmileIdentityError,
      );

      expect(global.fetch).toHaveBeenCalledTimes(3); // Initial + 2 retries
      
      jest.useFakeTimers(); // Restore fake timers
    }, 15000);

    it('should handle timeout errors', async () => {
      jest.useRealTimers(); // Use real timers for this test
      
      // Mock fetch to immediately reject with AbortError (simulating timeout)
      const abortError = { name: 'AbortError', message: 'The operation was aborted' };
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      await expect(httpClient.request(mockOptions, mockRetryOptions)).rejects.toThrow(
        SmileIdentityError,
      );

      // Verify it was called (and retried based on retry options)
      expect(global.fetch).toHaveBeenCalled();
      
      jest.useFakeTimers(); // Restore fake timers
    }, 10000);
  });
});

