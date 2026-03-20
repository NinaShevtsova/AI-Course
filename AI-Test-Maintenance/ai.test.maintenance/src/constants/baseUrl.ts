/**
 * Base URL for the application under test
 */
export const BASE_URL = 'https://playwright.dev';

/**
 * Absolute paths used for direct navigation (e.g. setOffline scenarios).
 * Built from BASE_URL to ensure a single source of truth across environments.
 */
export const PATHS = {
  docsIntro: `${BASE_URL}/docs/intro`,
} as const;