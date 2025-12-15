import { BaseService } from '../base.service';
import { SmileIdentityModuleOptions } from '../interfaces/module.interface';
import {
  SubmitJobRequest,
  SubmitJobResponse,
  GetJobStatusRequest,
  GetWebTokenRequest,
  GetWebTokenResponse,
} from '../interfaces/web-api.interface';
import { JobStatusResponse } from '../interfaces/job.interface';
import { SignatureService } from './signature.service';

export class WebApiService extends BaseService {
  private readonly signatureService: SignatureService;

  constructor(options: SmileIdentityModuleOptions) {
    super(options);
    this.signatureService = new SignatureService();
  }

  /**
   * Submit a job to Smile Identity (Biometric KYC, Document Verification, SmartSelfie™)
   * @param params - Job submission parameters
   * @returns Job submission response
   */
  async submitJob(params: {
    userId: string;
    jobId: string;
    jobType: number;
    imageDetails?: Array<{ image_type_id: number; image: string }>;
    idInfo?: {
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
  }): Promise<SubmitJobResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: SubmitJobRequest = {
      partner_id: this.options.partnerId,
      default_callback: this.options.defaultCallback,
      partner_params: {
        user_id: params.userId,
        job_id: params.jobId,
        job_type: params.jobType,
      },
      signature,
      timestamp: timestamp.toString(),
      source_sdk: 'nestjs',
      source_sdk_version: '1.0.0',
      ...(params.imageDetails && { image_details: params.imageDetails }),
      ...(params.idInfo && { id_info: params.idInfo }),
      ...(params.callbackUrl && { callback_url: params.callbackUrl }),
      ...Object.fromEntries(
        Object.entries(params).filter(
          ([key]) =>
            !['userId', 'jobId', 'jobType', 'imageDetails', 'idInfo', 'callbackUrl'].includes(key),
        ),
      ),
    };

    return this.post<SubmitJobResponse>('/upload', requestData);
  }

  /**
   * Get the status of a submitted job
   * @param userId - User ID used in job submission
   * @param jobId - Job ID used in job submission
   * @param options - Optional parameters (image_links, history)
   * @returns Job status response
   */
  async getJobStatus(
    userId: string,
    jobId: string,
    options?: {
      imageLinks?: boolean;
      history?: boolean;
    },
  ): Promise<JobStatusResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: GetJobStatusRequest = {
      user_id: userId,
      job_id: jobId,
      signature,
      timestamp: timestamp.toString(),
      ...(options?.imageLinks !== undefined && { image_links: options.imageLinks }),
      ...(options?.history !== undefined && { history: options.history }),
    };

    return this.post<JobStatusResponse>('/job_status', requestData);
  }

  /**
   * Get a web token for Hosted Web Integration
   * @param userId - User ID
   * @param jobId - Job ID
   * @param product - Product type
   * @param callbackUrl - Optional callback URL
   * @param additionalParams - Additional parameters
   * @returns Web token response
   */
  async getWebToken(
    userId: string,
    jobId: string,
    product: string,
    callbackUrl?: string,
    additionalParams?: Record<string, any>,
  ): Promise<GetWebTokenResponse> {
    const { signature, timestamp } = this.signatureService.generateSignature(
      this.options.partnerId,
      this.options.apiKey,
    );

    const requestData: GetWebTokenRequest = {
      user_id: userId,
      job_id: jobId,
      product,
      signature,
      timestamp: timestamp.toString(),
      ...(callbackUrl && { callback_url: callbackUrl }),
      ...additionalParams,
    };

    return this.post<GetWebTokenResponse>('/web_token', requestData);
  }
}

