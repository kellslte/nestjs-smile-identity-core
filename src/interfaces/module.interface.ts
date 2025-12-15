export interface SmileIdentityModuleOptions {
  /**
   * Your Smile Identity Partner ID
   */
  partnerId: string;

  /**
   * Your Smile Identity API Key
   */
  apiKey: string;

  /**
   * Default callback URL for job submissions
   */
  defaultCallback?: string;

  /**
   * Smile Identity API base URL
   * @default 'https://api.smileidentity.com/v1'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  retries?: number;

  /**
   * Initial delay between retries in milliseconds
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Maximum delay between retries in milliseconds
   * @default 10000
   */
  maxRetryDelay?: number;
}

export interface SmileIdentityModuleAsyncOptions {
  /**
   * Import existing providers
   */
  imports?: any[];

  /**
   * Provider that returns SmileIdentityModuleOptions
   */
  useFactory?: (...args: any[]) => Promise<SmileIdentityModuleOptions> | SmileIdentityModuleOptions;

  /**
   * Dependencies to inject into the factory
   */
  inject?: any[];
}
