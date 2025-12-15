import { UtilitiesService } from '../../src/services/utilities.service';
import { SmileIdentityModuleOptions } from '../../src/interfaces/module.interface';

describe('UtilitiesService', () => {
  let service: UtilitiesService;
  let mockOptions: SmileIdentityModuleOptions;

  beforeEach(() => {
    mockOptions = {
      partnerId: 'test-partner-id',
      apiKey: 'test-api-key',
      baseUrl: 'https://api.smileidentity.com/v1',
    };

    service = new UtilitiesService(mockOptions);

    // Mock the post method
    jest.spyOn(service as any, 'post').mockResolvedValue({
      job_complete: true,
      job_success: true,
      signature: 'test-signature',
      timestamp: '1234567890',
    });

    // Mock signature confirmation
    jest.spyOn(service['signatureService'], 'confirmSignature').mockReturnValue({
      valid: true,
      message: 'Signature is valid',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJobStatus', () => {
    it('should get job status with signature verification', async () => {
      const result = await service.getJobStatus('user-123', 'job-456');

      expect(result.job_complete).toBe(true);
      expect(service['post']).toHaveBeenCalled();
      expect(service['signatureService'].confirmSignature).toHaveBeenCalled();
    });

    it('should throw error on invalid signature', async () => {
      jest.spyOn(service['signatureService'], 'confirmSignature').mockReturnValue({
        valid: false,
        message: 'Signature is invalid',
      });

      await expect(service.getJobStatus('user-123', 'job-456')).rejects.toThrow(
        'Invalid signature in response',
      );
    });

    it('should handle optional parameters', async () => {
      const result = await service.getJobStatus('user-123', 'job-456', {
        imageLinks: true,
        history: true,
      });

      expect(result.job_complete).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });
});

