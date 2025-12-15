# @scwar/nestjs-smile-identity-core

A comprehensive NestJS module for integrating with the Smile Identity API. This package provides a complete wrapper around all Smile Identity API endpoints with robust error handling, retries, and TypeScript support.

## Features

- 🚀 **Complete API Coverage**: All Smile Identity API endpoints implemented
- 🔄 **Automatic Retries**: Built-in retry mechanism with exponential backoff
- 🛡️ **Robust Error Handling**: Comprehensive error handling with detailed error messages
- 📝 **TypeScript Support**: Full type definitions for all API requests and responses
- 🔐 **Signature Management**: Built-in signature generation and verification
- 🧪 **Comprehensive Testing**: Extensive test coverage for all endpoints
- ⚡ **Performance**: Uses native fetch API for optimal performance
- 🔧 **Configurable**: Easy configuration through NestJS module options

## Installation

```bash
npm install @scwar/nestjs-smile-identity-core
```

## Quick Start

### 1. Import the module

```typescript
import { SmileIdentityModule } from '@scwar/nestjs-smile-identity-core';

@Module({
  imports: [
    SmileIdentityModule.forRoot({
      partnerId: 'your-smile-identity-partner-id',
      apiKey: 'your-smile-identity-api-key',
      baseUrl: 'https://api.smileidentity.com/v1',
      timeout: 30000,
      retries: 3,
    }),
  ],
})
export class AppModule {}
```

### 2. Inject and use the service

```typescript
import { SmileIdentityService } from '@scwar/nestjs-smile-identity-core';
import { JobType } from '@scwar/nestjs-smile-identity-core';

@Injectable()
export class VerificationService {
  constructor(private readonly smileIdentityService: SmileIdentityService) {}

  async submitKyc(userId: string, jobId: string, imageBase64: string) {
    return this.smileIdentityService.webApi.submitJob({
      userId,
      jobId,
      jobType: JobType.BIOMETRIC_KYC,
      imageDetails: [
        {
          image_type_id: 0,
          image: imageBase64,
        },
      ],
      callbackUrl: 'https://your-domain.com/callback',
    });
  }
}
```

## Configuration Options

```typescript
interface SmileIdentityModuleOptions {
  partnerId: string;
  apiKey: string;
  defaultCallback?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
}
```

## Available Services

### WebApi Service

The WebApi service handles jobs that require images:

- **submitJob**: Submit jobs for Biometric KYC, Document Verification, SmartSelfie™ Authentication
- **getJobStatus**: Retrieve job status and results
- **getWebToken**: Generate web token for Hosted Web Integration

### IDApi Service

The IDApi service handles ID verification jobs:

- **submitEnhancedKyc**: Submit Enhanced KYC job
- **submitBasicKyc**: Submit Basic KYC job
- **submitBusinessVerification**: Submit Business Verification job
- **submitJob**: Generic job submission (alias for submitEnhancedKyc)

### Signature Service

The Signature service handles cryptographic operations:

- **generateSignature**: Generate cryptographic signature for API requests
- **confirmSignature**: Validate signatures from API responses

### Utilities Service

The Utilities service provides utility functions:

- **getJobStatus**: Get job status with automatic signature verification

## Usage Examples

### Biometric KYC

```typescript
const response = await this.smileIdentityService.webApi.submitJob({
  userId: 'user-123',
  jobId: 'job-456',
  jobType: JobType.BIOMETRIC_KYC,
  imageDetails: [
    {
      image_type_id: 0, // Selfie
      image: base64EncodedImage,
    },
  ],
  callbackUrl: 'https://your-domain.com/callback',
});
```

### Enhanced KYC

```typescript
const response = await this.smileIdentityService.idApi.submitEnhancedKyc({
  userId: 'user-123',
  jobId: 'job-456',
  idInfo: {
    first_name: 'John',
    last_name: 'Doe',
    country: 'NG',
    id_type: 1, // National ID
    id_number: '12345678901',
    dob: '1990-01-01',
  },
});
```

### Get Job Status

```typescript
const status = await this.smileIdentityService.webApi.getJobStatus('user-123', 'job-456', {
  imageLinks: true,
  history: true,
});
```

### Generate Signature

```typescript
const { signature, timestamp } = this.smileIdentityService.signature.generateSignature(
  partnerId,
  apiKey,
);
```

### Get Web Token

```typescript
const token = await this.smileIdentityService.webApi.getWebToken(
  'user-123',
  'job-456',
  'biometric_kyc',
  'https://your-domain.com/callback',
);
```

## Error Handling

The package provides comprehensive error handling with detailed error messages:

```typescript
try {
  const result = await this.smileIdentityService.webApi.submitJob(data);
} catch (error) {
  if (error instanceof SmileIdentityError) {
    console.log('Smile Identity Error:', error.message);
    console.log('Error Code:', error.code);
    console.log('HTTP Status:', error.status);
  }
}
```

## Retry Mechanism

Automatic retries with exponential backoff for failed requests:

```typescript
// Configure retries in module options
SmileIdentityModule.forRoot({
  partnerId: 'your-partner-id',
  apiKey: 'your-api-key',
  retries: 3,           // Number of retry attempts
  retryDelay: 1000,     // Initial delay in ms
  maxRetryDelay: 10000, // Maximum delay in ms
})
```

## Job Types

The package includes the following job types:

- `BIOMETRIC_KYC` (1): Biometric KYC verification
- `SMART_SELFIE_AUTH` (2): SmartSelfie™ Authentication
- `SMART_SELFIE_REGISTRATION` (4): SmartSelfie™ Registration
- `DOCUMENT_VERIFICATION` (5): Document Verification
- `ENHANCED_KYC` (5): Enhanced KYC
- `BASIC_KYC` (5): Basic KYC
- `BUSINESS_VERIFICATION` (5): Business Verification

## ID Types

Supported ID types for document verification:

- `NATIONAL_ID` (1): National ID
- `PASSPORT` (2): Passport
- `DRIVERS_LICENSE` (3): Driver's License
- `VOTERS_ID` (4): Voter's ID

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## Version Management & Releases

This package includes an automated version bumping system that follows semantic versioning and conventional commits.

### Automatic Version Bumping

The system automatically determines the appropriate version bump based on your commits:

```bash
# Automatically determine and bump version
npm run version:auto

# Manual version bumps
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0
npm run version:major  # 1.0.0 → 2.0.0
```

### Conventional Commits

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Feature commits (minor version bump)
git commit -m "feat: add new verification method"

# Bug fix commits (patch version bump)
git commit -m "fix: resolve authentication issue"

# Breaking change commits (major version bump)
git commit -m "feat!: breaking change in API"

# Documentation commits (no version bump)
git commit -m "docs: update README with examples"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commit format
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Important**: All commits must follow the conventional commit format to ensure proper version bumping.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the maintainers.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

