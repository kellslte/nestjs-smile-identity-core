/**
 * Signature generation request
 */
export interface GenerateSignatureRequest {
  partnerId: string;
  apiKey: string;
  timestamp?: number;
}

/**
 * Signature generation response
 */
export interface GenerateSignatureResponse {
  signature: string;
  timestamp: number;
}

/**
 * Signature confirmation request
 */
export interface ConfirmSignatureRequest {
  timestamp: number;
  signature: string;
  partnerId: string;
  apiKey: string;
}

/**
 * Signature confirmation response
 */
export interface ConfirmSignatureResponse {
  valid: boolean;
  message?: string;
}

