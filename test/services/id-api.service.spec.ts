import { IdApiService } from '../../src/services/id-api.service';
import { SmileIdentityModuleOptions } from '../../src/interfaces/module.interface';

describe('IdApiService', () => {
  let service: IdApiService;
  let mockOptions: SmileIdentityModuleOptions;

  beforeEach(() => {
    mockOptions = {
      partnerId: 'test-partner-id',
      apiKey: 'test-api-key',
      baseUrl: 'https://api.smileidentity.com/v1',
    };

    service = new IdApiService(mockOptions);

    // Mock the post method
    jest.spyOn(service as any, 'post').mockResolvedValue({
      success: true,
      SmileJobID: 'test-job-id',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitEnhancedKyc', () => {
    it('should submit an enhanced KYC job', async () => {
      const params = {
        userId: 'user-123',
        jobId: 'job-456',
        idInfo: {
          first_name: 'John',
          last_name: 'Doe',
          id_type: 1,
          id_number: '123456789',
        },
      };

      const result = await service.submitEnhancedKyc(params);

      expect(result.success).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });

  describe('submitBasicKyc', () => {
    it('should submit a basic KYC job', async () => {
      const params = {
        userId: 'user-123',
        jobId: 'job-456',
        idInfo: {
          first_name: 'John',
          last_name: 'Doe',
          id_type: 1,
          id_number: '123456789',
        },
      };

      const result = await service.submitBasicKyc(params);

      expect(result.success).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });

  describe('submitBusinessVerification', () => {
    it('should submit a business verification job', async () => {
      const params = {
        userId: 'user-123',
        jobId: 'job-456',
        idInfo: {
          business_name: 'Test Business',
          business_type: 'LLC',
          business_registration_number: 'REG123',
        },
      };

      const result = await service.submitBusinessVerification(params);

      expect(result.success).toBe(true);
      expect(service['post']).toHaveBeenCalled();
    });
  });

  describe('submitJob', () => {
    it('should submit a job (alias for submitEnhancedKyc)', async () => {
      const params = {
        userId: 'user-123',
        jobId: 'job-456',
        idInfo: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      jest.spyOn(service, 'submitEnhancedKyc').mockResolvedValue({
        success: true,
        SmileJobID: 'test-job-id',
      });

      const result = await service.submitJob(params);

      expect(result.success).toBe(true);
      expect(service.submitEnhancedKyc).toHaveBeenCalledWith(params);
    });
  });
});

