import { JobStatusResponse } from './job.interface';

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

