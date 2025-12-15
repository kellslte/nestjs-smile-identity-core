import { BaseService } from '../base.service';
import { SmileIdentityModuleOptions } from '../interfaces/module.interface';
import {
  EnhancedKycRequest,
  BasicKycRequest,
  BusinessVerificationRequest,
  IdApiJobResponse,
} from '../interfaces/id-api.interface';
import { SignatureService } from './signature.service';

export class IdApiService extends BaseService {
  private readonly signatureService: SignatureService;

  constructor(options: SmileIdentityModuleOptions) {
    super(options);
    this.signatureService = new SignatureService();
  }

  /**
   * Submit an Enhanced KYC job
   * @param params - Enhanced KYC job parameters
   * @returns Job submission response
   */
  async submitEnhancedKyc(params: {
    userId: string;
    jobId: string;
    idInfo: {
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      country?: string;
      id_type?: number;
      id_number?: string;
      dob?: string;
      phone_number?: string;
      entered?: boolean;
    };
    callbackUrl?: string;
    [key: string]: any;
  }): Promise<IdApiJobResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: EnhancedKycRequest = {
      partner_id: this.options.partnerId,
      default_callback: this.options.defaultCallback,
      partner_params: {
        user_id: params.userId,
        job_id: params.jobId,
        job_type: 5, // Enhanced KYC
      },
      id_info: params.idInfo,
      signature,
      timestamp: timestamp.toString(),
      source_sdk: 'nestjs',
      source_sdk_version: '1.0.0',
      ...(params.callbackUrl && { callback_url: params.callbackUrl }),
      ...Object.fromEntries(
        Object.entries(params).filter(
          ([key]) => !['userId', 'jobId', 'idInfo', 'callbackUrl'].includes(key),
        ),
      ),
    };

    return this.post<IdApiJobResponse>('/id_verification', requestData);
  }

  /**
   * Submit a Basic KYC job
   * @param params - Basic KYC job parameters
   * @returns Job submission response
   */
  async submitBasicKyc(params: {
    userId: string;
    jobId: string;
    idInfo: {
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      country?: string;
      id_type?: number;
      id_number?: string;
      dob?: string;
      phone_number?: string;
      entered?: boolean;
    };
    callbackUrl?: string;
    [key: string]: any;
  }): Promise<IdApiJobResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: BasicKycRequest = {
      partner_id: this.options.partnerId,
      default_callback: this.options.defaultCallback,
      partner_params: {
        user_id: params.userId,
        job_id: params.jobId,
        job_type: 5, // Basic KYC
      },
      id_info: params.idInfo,
      signature,
      timestamp: timestamp.toString(),
      source_sdk: 'nestjs',
      source_sdk_version: '1.0.0',
      ...(params.callbackUrl && { callback_url: params.callbackUrl }),
      ...Object.fromEntries(
        Object.entries(params).filter(
          ([key]) => !['userId', 'jobId', 'idInfo', 'callbackUrl'].includes(key),
        ),
      ),
    };

    return this.post<IdApiJobResponse>('/id_verification', requestData);
  }

  /**
   * Submit a Business Verification job
   * @param params - Business Verification job parameters
   * @returns Job submission response
   */
  async submitBusinessVerification(params: {
    userId: string;
    jobId: string;
    idInfo: {
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      country?: string;
      id_type?: number;
      id_number?: string;
      dob?: string;
      phone_number?: string;
      entered?: boolean;
      business_name?: string;
      business_type?: string;
      business_registration_number?: string;
      [key: string]: any;
    };
    callbackUrl?: string;
    [key: string]: any;
  }): Promise<IdApiJobResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: BusinessVerificationRequest = {
      partner_id: this.options.partnerId,
      default_callback: this.options.defaultCallback,
      partner_params: {
        user_id: params.userId,
        job_id: params.jobId,
        job_type: 5, // Business Verification
      },
      id_info: params.idInfo,
      signature,
      timestamp: timestamp.toString(),
      source_sdk: 'nestjs',
      source_sdk_version: '1.0.0',
      ...(params.callbackUrl && { callback_url: params.callbackUrl }),
      ...Object.fromEntries(
        Object.entries(params).filter(
          ([key]) => !['userId', 'jobId', 'idInfo', 'callbackUrl'].includes(key),
        ),
      ),
    };

    return this.post<IdApiJobResponse>('/id_verification', requestData);
  }

  /**
   * Submit a generic ID verification job (alias for submitEnhancedKyc)
   * @param params - Job submission parameters
   * @returns Job submission response
   */
  async submitJob(params: {
    userId: string;
    jobId: string;
    idInfo: {
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      country?: string;
      id_type?: number;
      id_number?: string;
      dob?: string;
      phone_number?: string;
      entered?: boolean;
      [key: string]: any;
    };
    callbackUrl?: string;
    [key: string]: any;
  }): Promise<IdApiJobResponse> {
    return this.submitEnhancedKyc(params);
  }
}

