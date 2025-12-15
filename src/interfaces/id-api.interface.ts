import { IdInfo, JobStatusResponse } from './job.interface';

/**
 * Enhanced KYC job submission request
 */
export interface EnhancedKycRequest {
  partner_id: string;
  default_callback?: string;
  partner_params: {
    user_id: string;
    job_id: string;
    job_type: 5; // Enhanced KYC
  };
  id_info: IdInfo;
  signature: string;
  timestamp: string;
  source_sdk?: string;
  source_sdk_version?: string;
  callback_url?: string;
  [key: string]: any;
}

/**
 * Basic KYC job submission request
 */
export interface BasicKycRequest {
  partner_id: string;
  default_callback?: string;
  partner_params: {
    user_id: string;
    job_id: string;
    job_type: 5; // Basic KYC
  };
  id_info: IdInfo;
  signature: string;
  timestamp: string;
  source_sdk?: string;
  source_sdk_version?: string;
  callback_url?: string;
  [key: string]: any;
}

/**
 * Business Verification job submission request
 */
export interface BusinessVerificationRequest {
  partner_id: string;
  default_callback?: string;
  partner_params: {
    user_id: string;
    job_id: string;
    job_type: 5; // Business Verification
  };
  id_info: IdInfo;
  signature: string;
  timestamp: string;
  source_sdk?: string;
  source_sdk_version?: string;
  callback_url?: string;
  [key: string]: any;
}

/**
 * ID API job submission response
 */
export interface IdApiJobResponse {
  success: boolean;
  SmileJobID?: string;
  signature?: string;
  timestamp?: string;
  [key: string]: any;
}

