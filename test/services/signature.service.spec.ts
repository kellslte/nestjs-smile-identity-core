import { SignatureService } from '../../src/services/signature.service';

describe('SignatureService', () => {
  let service: SignatureService;

  beforeEach(() => {
    service = new SignatureService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSignature', () => {
    it('should generate a signature', () => {
      const partnerId = 'test-partner-id';
      const apiKey = 'test-api-key';
      const result = service.generateSignature(partnerId, apiKey);

      expect(result).toHaveProperty('signature');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.signature).toBe('string');
      expect(typeof result.timestamp).toBe('number');
    });

    it('should use provided timestamp', () => {
      const partnerId = 'test-partner-id';
      const apiKey = 'test-api-key';
      const timestamp = 1234567890;
      const result = service.generateSignature(partnerId, apiKey, timestamp);

      expect(result.timestamp).toBe(timestamp);
      expect(result.signature).toBeDefined();
    });

    it('should generate consistent signatures for same input', () => {
      const partnerId = 'test-partner-id';
      const apiKey = 'test-api-key';
      const timestamp = 1234567890;

      const result1 = service.generateSignature(partnerId, apiKey, timestamp);
      const result2 = service.generateSignature(partnerId, apiKey, timestamp);

      expect(result1.signature).toBe(result2.signature);
    });
  });

  describe('confirmSignature', () => {
    it('should confirm a valid signature', () => {
      const partnerId = 'test-partner-id';
      const apiKey = 'test-api-key';
      const { signature, timestamp } = service.generateSignature(partnerId, apiKey);

      const result = service.confirmSignature(timestamp, signature, partnerId, apiKey);

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Signature is valid');
    });

    it('should reject an invalid signature', () => {
      const partnerId = 'test-partner-id';
      const apiKey = 'test-api-key';
      const { timestamp } = service.generateSignature(partnerId, apiKey);
      const invalidSignature = 'invalid-signature';

      const result = service.confirmSignature(timestamp, invalidSignature, partnerId, apiKey);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Signature is invalid');
    });
  });
});

