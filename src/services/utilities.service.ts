import { BaseService } from '../base.service';
import { SmileIdentityModuleOptions } from '../interfaces/module.interface';
import { GetJobStatusRequest } from '../interfaces/utilities.interface';
import { JobStatusResponse } from '../interfaces/job.interface';
import { SignatureService } from './signature.service';

export class UtilitiesService extends BaseService {
  private readonly signatureService: SignatureService;

  constructor(options: SmileIdentityModuleOptions) {
    super(options);
    this.signatureService = new SignatureService();
  }

  /**
   * Get job status with signature verification
   * @param userId - User ID used in job submission
   * @param jobId - Job ID used in job submission
   * @param options - Optional parameters (image_links, history)
   * @returns Job status response with verified signature
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

    const response = await this.post<JobStatusResponse>('/job_status', requestData);

    // Verify the signature from the response if present
    if (response.signature && response.timestamp) {
      const isValid = this.signatureService.confirmSignature(
        parseInt(response.timestamp),
        response.signature,
        this.options.partnerId,
        this.options.apiKey,
      );

      if (!isValid.valid) {
        throw new Error('Invalid signature in response');
      }
    }

    return response;
  }
}

