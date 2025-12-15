import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  GenerateSignatureResponse,
  ConfirmSignatureResponse,
} from '../interfaces/signature.interface';

@Injectable()
export class SignatureService {
  /**
   * Generate a cryptographic signature for Smile Identity API requests
   * @param partnerId - Your Smile Identity Partner ID
   * @param apiKey - Your Smile Identity API Key
   * @param timestamp - Optional timestamp (defaults to current time)
   * @returns Signature and timestamp
   */
  generateSignature(
    partnerId: string,
    apiKey: string,
    timestamp?: number,
  ): GenerateSignatureResponse {
    const timestampValue = timestamp || Math.floor(Date.now() / 1000);
    const message = `${partnerId}:${timestampValue}`;
    const signature = crypto.createHmac('sha256', apiKey).update(message).digest('hex');

    return {
      signature,
      timestamp: timestampValue,
    };
  }

  /**
   * Confirm/validate a signature from Smile Identity API response
   * @param timestamp - Timestamp from the response
   * @param signature - Signature from the response
   * @param partnerId - Your Smile Identity Partner ID
   * @param apiKey - Your Smile Identity API Key
   * @returns Whether the signature is valid
   */
  confirmSignature(
    timestamp: number,
    signature: string,
    partnerId: string,
    apiKey: string,
  ): ConfirmSignatureResponse {
    const expectedSignature = this.generateSignature(partnerId, apiKey, timestamp);
    const isValid = expectedSignature.signature === signature;

    return {
      valid: isValid,
      message: isValid ? 'Signature is valid' : 'Signature is invalid',
    };
  }
}
