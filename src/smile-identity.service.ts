import { Injectable, Inject } from '@nestjs/common';
import { SMILE_IDENTITY_MODULE_OPTIONS } from './constants';
import { SmileIdentityModuleOptions } from './interfaces';
import { WebApiService } from './services/web-api.service';
import { IdApiService } from './services/id-api.service';
import { SignatureService } from './services/signature.service';
import { UtilitiesService } from './services/utilities.service';

@Injectable()
export class SmileIdentityService {
  public readonly webApi: WebApiService;
  public readonly idApi: IdApiService;
  public readonly signature: SignatureService;
  public readonly utilities: UtilitiesService;

  constructor(@Inject(SMILE_IDENTITY_MODULE_OPTIONS) private readonly options: SmileIdentityModuleOptions) {
    this.webApi = new WebApiService(this.options);
    this.idApi = new IdApiService(this.options);
    this.signature = new SignatureService();
    this.utilities = new UtilitiesService(this.options);
  }

  /**
   * Get the current configuration
   */
  getConfig(): SmileIdentityModuleOptions {
    return { ...this.options };
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.options.partnerId && this.options.apiKey);
  }
}

