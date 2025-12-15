import { BaseService } from '../src/base.service';
import { HttpClient } from '../src/http-client';
import { SmileIdentityModuleOptions } from '../src/interfaces/module.interface';

// Create a concrete implementation of BaseService for testing
class TestService extends BaseService {
  async testGet(endpoint: string, params?: Record<string, any>) {
    return this.get(endpoint, params);
  }

  async testPost(endpoint: string, data?: any) {
    return this.post(endpoint, data);
  }

  async testPut(endpoint: string, data?: any) {
    return this.put(endpoint, data);
  }

  async testDelete(endpoint: string) {
    return this.delete(endpoint);
  }
}

// Mock HttpClient
jest.mock('../src/http-client');

describe('BaseService', () => {
  let service: TestService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockOptions: SmileIdentityModuleOptions = {
    partnerId: 'test-partner-id',
    apiKey: 'test-api-key',
    baseUrl: 'https://api.smileidentity.com/v1',
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    maxRetryDelay: 10000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new TestService(mockOptions);

    mockHttpClient = service['httpClient'] as jest.Mocked<HttpClient>;
    mockHttpClient.request = jest.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      data: { success: true },
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBaseUrl', () => {
    it('should return configured base URL', () => {
      const url = service['getBaseUrl']();
      expect(url).toBe('https://api.smileidentity.com/v1');
    });

    it('should return default base URL if not configured', () => {
      const serviceWithoutUrl = new TestService({
        partnerId: 'test',
        apiKey: 'test',
      });
      const url = serviceWithoutUrl['getBaseUrl']();
      expect(url).toBe('https://api.smileidentity.com/v1');
    });
  });

  describe('get', () => {
    it('should make a GET request', async () => {
      const result = await service.testGet('/test', { param1: 'value1' });

      expect(mockHttpClient.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/test'),
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('post', () => {
    it('should make a POST request', async () => {
      const data = { key: 'value' };
      const result = await service.testPost('/test', data);

      expect(mockHttpClient.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/test'),
          body: data,
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('put', () => {
    it('should make a PUT request', async () => {
      const data = { key: 'value' };
      const result = await service.testPut('/test', data);

      expect(mockHttpClient.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: expect.stringContaining('/test'),
          body: data,
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should make a DELETE request', async () => {
      const result = await service.testDelete('/test');

      expect(mockHttpClient.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining('/test'),
        }),
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });
});

