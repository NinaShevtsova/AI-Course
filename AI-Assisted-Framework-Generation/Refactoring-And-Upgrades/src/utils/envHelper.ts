/**
 * Environment helper methods for Playwright configuration and tests.
 */
export class EnvHelper {
  /**
   * Returns a required environment variable or throws when missing.
   */
  public static getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
  }

  /**
   * Returns an optional environment variable with fallback.
   */
  public static getOptionalEnv(name: string, fallback: string): string {
    return process.env[name] ?? fallback;
  }
}

/**
 * Resolves the base URL for UI tests.
 */
export function getBaseUrl(): string {
  return EnvHelper.getOptionalEnv('BASE_URL', 'http://localhost:3000');
}
