import { WebApiService } from '../../src/services/web-api.service';
import { SmileIdentityModuleOptions } from '../../src/interfaces/module.interface';
import { JobType } from '../../src/interfaces/job.interface';

describe('WebApiService', () => {
  let service: WebApiService;
  let mockOptions: SmileIdentityModuleOptions;

  beforeEach(() => {
    mockOptions = {
      partnerId: 'test-partner-id',
      apiKey: 'test-api-key',
      baseUrl: 'https://api.smileidentity.com/v1',
    };

    service = new WebApiService(mockOptions);

    // Mock the post method
    jest.spyOn(service as any, 'post').mockResolvedValue({
      success: true,
      SmileJobID: 'test-job-id',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitJob', () => {
    it('should submit a job', async () => {
      const params = {
        userId: 'user-123',
        jobId: 'job-456',
        jobType: JobType.BIOMETRIC_KYC,
        imageDetails: [
          {
            image_type_id: 0,
            image: 'base64-encoded-image',
          },
        ],
      };

      const result = await service.submitJob(params);

      expect(result.success).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });

  describe('getJobStatus', () => {
    it('should get job status', async () => {
      jest.spyOn(service as any, 'post').mockResolvedValue({
        job_complete: true,
        job_success: true,
      });

      const result = await service.getJobStatus('user-123', 'job-456');

      expect(result.job_complete).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });

  describe('getWebToken', () => {
    it('should get web token', async () => {
      jest.spyOn(service as any, 'post').mockResolvedValue({
        success: true,
        token: 'test-token',
      });

      const result = await service.getWebToken('user-123', 'job-456', 'biometric_kyc');

      expect(result.success).toBe(true);
      expect(result.token).toBe('test-token');
      expect(service['post']).toHaveBeenCalled();
    });
  });
});
