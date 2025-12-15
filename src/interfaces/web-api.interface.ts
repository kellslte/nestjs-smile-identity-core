import { JobType, ImageData, IdInfo, JobStatusResponse } from './job.interface';

/**
 * Submit job request parameters
 */
export interface SubmitJobRequest {
  partner_id: string;
  default_callback?: string;
  partner_params: {
    user_id: string;
    job_id: string;
    job_type: JobType;
  };
  source_sdk?: string;
  source_sdk_version?: string;
  signature: string;
  timestamp: string;
  image_details?: ImageData[];
  id_info?: IdInfo;
  callback_url?: string;
  [key: string]: any;
}

/**
 * Submit job response
 */
export interface SubmitJobResponse {
  success: boolean;
  SmileJobID?: string;
  signature?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Get job status request parameters
 */
export interface GetJobStatusRequest {
  user_id: string;
  job_id: string;
  image_links?: boolean;
  history?: boolean;
  signature?: string;
  timestamp?: string;
}

/**
 * Get web token request parameters
 */
export interface GetWebTokenRequest {
  user_id: string;
  job_id: string;
  product: string;
  callback_url?: string;
  [key: string]: any;
}

/**
 * Get web token response
 */
export interface GetWebTokenResponse {
  success: boolean;
  token?: string;
  [key: string]: any;
}

