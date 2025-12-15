import { SmileIdentityModule } from '@scwar/nestjs-smile-identity-core';
import { Module } from '@nestjs/common';

// Example 1: Basic Module Configuration
@Module({
  imports: [
    SmileIdentityModule.forRoot({
      partnerId: 'your-partner-id',
      apiKey: 'your-api-key',
      baseUrl: 'https://api.smileidentity.com/v1',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      maxRetryDelay: 10000,
    }),
  ],
})
export class BasicSmileIdentityModule {}

// Example 2: Async Module Configuration
@Module({
  imports: [
    SmileIdentityModule.forRootAsync({
      useFactory: () => ({
        partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
        apiKey: process.env.SMILE_IDENTITY_API_KEY,
        baseUrl: process.env.SMILE_IDENTITY_BASE_URL || 'https://api.smileidentity.com/v1',
        timeout: parseInt(process.env.SMILE_IDENTITY_TIMEOUT || '30000') || 30000,
        retries: parseInt(process.env.SMILE_IDENTITY_RETRIES || '3') || 3,
      }),
    }),
  ],
})
export class AsyncSmileIdentityModule {}

// Example 3: Service Usage
import { SmileIdentityService } from '@scwar/nestjs-smile-identity-core';
import { Injectable } from '@nestjs/common';
import { JobType } from '@scwar/nestjs-smile-identity-core';

@Injectable()
export class IdentityVerificationService {
  constructor(private readonly smileIdentityService: SmileIdentityService) {}

  // Submit a Biometric KYC job
  async submitBiometricKyc(userId: string, jobId: string, imageBase64: string) {
    try {
      const response = await this.smileIdentityService.webApi.submitJob({
        userId,
        jobId,
        jobType: JobType.BIOMETRIC_KYC,
        imageDetails: [
          {
            image_type_id: 0, // Selfie image
            image: imageBase64,
          },
        ],
        callbackUrl: 'https://your-domain.com/callback',
      });

      return {
        success: true,
        smileJobId: response.SmileJobID,
      };
    } catch (error) {
      console.error('Biometric KYC submission failed:', error);
      throw error;
    }
  }

  // Get job status
  async getJobStatus(userId: string, jobId: string) {
    try {
      const response = await this.smileIdentityService.webApi.getJobStatus(userId, jobId, {
        imageLinks: true,
        history: true,
      });

      return {
        jobComplete: response.job_complete,
        jobSuccess: response.job_success,
        result: response.result,
      };
    } catch (error) {
      console.error('Job status check failed:', error);
      throw error;
    }
  }

  // Submit Enhanced KYC
  async submitEnhancedKyc(userId: string, jobId: string, idInfo: any) {
    try {
      const response = await this.smileIdentityService.idApi.submitEnhancedKyc({
        userId,
        jobId,
        idInfo: {
          first_name: idInfo.firstName,
          last_name: idInfo.lastName,
          country: idInfo.country,
          id_type: idInfo.idType,
          id_number: idInfo.idNumber,
          dob: idInfo.dob,
        },
        callbackUrl: 'https://your-domain.com/callback',
      });

      return {
        success: true,
        smileJobId: response.SmileJobID,
      };
    } catch (error) {
      console.error('Enhanced KYC submission failed:', error);
      throw error;
    }
  }

  // Submit Basic KYC
  async submitBasicKyc(userId: string, jobId: string, idInfo: any) {
    try {
      const response = await this.smileIdentityService.idApi.submitBasicKyc({
        userId,
        jobId,
        idInfo: {
          first_name: idInfo.firstName,
          last_name: idInfo.lastName,
          country: idInfo.country,
          id_type: idInfo.idType,
          id_number: idInfo.idNumber,
        },
      });

      return {
        success: true,
        smileJobId: response.SmileJobID,
      };
    } catch (error) {
      console.error('Basic KYC submission failed:', error);
      throw error;
    }
  }

  // Submit Business Verification
  async submitBusinessVerification(userId: string, jobId: string, businessInfo: any) {
    try {
      const response = await this.smileIdentityService.idApi.submitBusinessVerification({
        userId,
        jobId,
        idInfo: {
          business_name: businessInfo.businessName,
          business_type: businessInfo.businessType,
          business_registration_number: businessInfo.registrationNumber,
        },
      });

      return {
        success: true,
        smileJobId: response.SmileJobID,
      };
    } catch (error) {
      console.error('Business verification submission failed:', error);
      throw error;
    }
  }

  // Generate signature
  async generateSignature(timestamp?: number) {
    const result = this.smileIdentityService.signature.generateSignature(
      process.env.SMILE_IDENTITY_PARTNER_ID!,
      process.env.SMILE_IDENTITY_API_KEY!,
      timestamp,
    );

    return {
      signature: result.signature,
      timestamp: result.timestamp,
    };
  }

  // Confirm signature
  async confirmSignature(timestamp: number, signature: string) {
    const result = this.smileIdentityService.signature.confirmSignature(
      timestamp,
      signature,
      process.env.SMILE_IDENTITY_PARTNER_ID!,
      process.env.SMILE_IDENTITY_API_KEY!,
    );

    return {
      valid: result.valid,
      message: result.message,
    };
  }

  // Get job status with signature verification (Utilities)
  async getJobStatusWithVerification(userId: string, jobId: string) {
    try {
      const response = await this.smileIdentityService.utilities.getJobStatus(userId, jobId, {
        imageLinks: true,
        history: true,
      });

      return {
        jobComplete: response.job_complete,
        jobSuccess: response.job_success,
        result: response.result,
      };
    } catch (error) {
      console.error('Job status check with verification failed:', error);
      throw error;
    }
  }

  // Get web token for Hosted Web Integration
  async getWebToken(userId: string, jobId: string, product: string) {
    try {
      const response = await this.smileIdentityService.webApi.getWebToken(
        userId,
        jobId,
        product,
        'https://your-domain.com/callback',
      );

      return {
        success: true,
        token: response.token,
      };
    } catch (error) {
      console.error('Web token generation failed:', error);
      throw error;
    }
  }
}

