import { EnvHelper } from '../utils/envHelper';

/**
 * Credentials for a reusable existing UI test user.
 */
export type ExistingUserCredentials = {
  email: string;
  password: string;
};

/**
 * Returns credentials for an existing application user from environment variables.
 */
export function getExistingUserCredentials(): ExistingUserCredentials {
  return {
    email: EnvHelper.getOptionalEnv('E2E_USER_EMAIL', 'qa.user@example.com'),
    password: EnvHelper.getOptionalEnv('E2E_USER_PASSWORD', 'OldPass123'),
  };
}
