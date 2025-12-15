import { Test, TestingModule } from '@nestjs/testing';
import { SmileIdentityService } from '../src/smile-identity.service';
import { SMILE_IDENTITY_MODULE_OPTIONS } from '../src/constants';
import { SmileIdentityModuleOptions } from '../src/interfaces/module.interface';

describe('SmileIdentityService', () => {
  let service: SmileIdentityService;
  let module: TestingModule;

  const mockOptions: SmileIdentityModuleOptions = {
    partnerId: 'test-partner-id',
    apiKey: 'test-api-key',
    baseUrl: 'https://api.smileidentity.com/v1',
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: SMILE_IDENTITY_MODULE_OPTIONS,
          useValue: mockOptions,
        },
        SmileIdentityService,
      ],
    }).compile();

    service = module.get<SmileIdentityService>(SmileIdentityService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have webApi service', () => {
    expect(service.webApi).toBeDefined();
  });

  it('should have idApi service', () => {
    expect(service.idApi).toBeDefined();
  });

  it('should have signature service', () => {
    expect(service.signature).toBeDefined();
  });

  it('should have utilities service', () => {
    expect(service.utilities).toBeDefined();
  });

  it('should get config', () => {
    const config = service.getConfig();
    expect(config).toEqual(mockOptions);
  });

  it('should check if configured', () => {
    expect(service.isConfigured()).toBe(true);
  });

  it('should return false if not configured', () => {
    const unconfiguredService = new SmileIdentityService({
      partnerId: '',
      apiKey: '',
    } as SmileIdentityModuleOptions);

    expect(unconfiguredService.isConfigured()).toBe(false);
  });
});

