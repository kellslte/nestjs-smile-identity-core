/**
 * Job types supported by Smile Identity
 * Note: Job type 5 is used for multiple verification types (Document Verification,
 * Enhanced KYC, Basic KYC, Business Verification) and is differentiated by other parameters
 */
export enum JobType {
  BIOMETRIC_KYC = 1,
  SMART_SELFIE_AUTH = 2,
  SMART_SELFIE_REGISTRATION = 4,
  DOCUMENT_VERIFICATION = 5,
  // The following all use job_type 5 but are differentiated by other parameters
  ENHANCED_KYC = 5, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  BASIC_KYC = 5, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  BUSINESS_VERIFICATION = 5, // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
}

/**
 * Job status values
 */
export enum JobStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVIEW = 'review',
}

/**
 * ID types for document verification
 */
export enum IdType {
  NATIONAL_ID = 1,
  PASSPORT = 2,
  DRIVERS_LICENSE = 3,
  VOTERS_ID = 4,
}

/**
 * Image type for job submission
 */
export interface ImageData {
  image_type_id: number;
  image: string; // Base64 encoded image
}

/**
 * ID information for job submission
 */
export interface IdInfo {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  country?: string;
  id_type?: IdType;
  id_number?: string;
  dob?: string;
  phone_number?: string;
  entered?: boolean;
}

/**
 * Job result data
 */
export interface JobResult {
  ResultCode: string;
  ResultText: string;
  ResultType: string;
  SmileJobID: string;
  PartnerParams: {
    user_id: string;
    job_id: string;
    job_type: number;
  };
  ConfidenceValue?: string;
  Actions?: {
    [key: string]: any;
  };
  Country?: string;
  IDType?: string;
  IDNumber?: string;
  ExpirationDate?: string;
  FullName?: string;
  DOB?: string;
  Photo?: string;
  [key: string]: any;
}

/**
 * Job status response
 */
export interface JobStatusResponse {
  job_complete: boolean;
  job_success: boolean;
  result?: JobResult;
  signature?: string;
  timestamp?: string;
  [key: string]: any;
}
