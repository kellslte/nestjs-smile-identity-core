import { DynamicModule, Module } from '@nestjs/common';
import { SMILE_IDENTITY_MODULE_OPTIONS } from './constants';
import { SmileIdentityModuleOptions, SmileIdentityModuleAsyncOptions } from './interfaces';
import { SmileIdentityService } from './smile-identity.service';
import {
  SMILE_IDENTITY_API_BASE_URL,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRIES,
  DEFAULT_RETRY_DELAY,
  DEFAULT_MAX_RETRY_DELAY,
} from './constants';

@Module({})
export class SmileIdentityModule {
  static forRoot(options: SmileIdentityModuleOptions): DynamicModule {
    return {
      module: SmileIdentityModule,
      providers: [
        {
          provide: SMILE_IDENTITY_MODULE_OPTIONS,
          useValue: {
            baseUrl: SMILE_IDENTITY_API_BASE_URL,
            timeout: DEFAULT_TIMEOUT,
            retries: DEFAULT_RETRIES,
            retryDelay: DEFAULT_RETRY_DELAY,
            maxRetryDelay: DEFAULT_MAX_RETRY_DELAY,
            ...options,
          },
        },
        SmileIdentityService,
      ],
      exports: [SmileIdentityService],
      global: true,
    };
  }

  static forRootAsync(options: SmileIdentityModuleAsyncOptions): DynamicModule {
    return {
      module: SmileIdentityModule,
      imports: options.imports || [],
      providers: [
        {
          provide: SMILE_IDENTITY_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        SmileIdentityService,
      ],
      exports: [SmileIdentityService],
      global: true,
    };
  }
}

