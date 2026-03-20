import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages/PlaywrightHomePage.js';
import { testData } from '../../src/fixtures/testData.js';

test.describe('Main Navigation', () => {
  /**
   * TC-001 Happy Path
   * Verifies that all three navigation links (Docs, API, Community) are
   * visible, carry correct ARIA roles/names, and route to the expected
   * destination pages — including heading and primary content validation.
   */
  test('TC-001 - should validate complete navigation workflow including accessibility and state preservation', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify all navigation links are visible and accessible', async () => {
      // Validates role="link", accessible name, visibility, and enabled state (TC-001 Steps 2–6)
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to Docs and verify target page', async () => {
      await homePage.clickDocs();
      await expect(page).toHaveURL(testData.urls.docs);
      // TC-001 Step 7: primary heading confirms correct page loaded
      await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
      // TC-001 Step 8: verify Docs sidebar is rendered, confirming full page content loaded
      await expect(page.getByRole('navigation', { name: 'Docs sidebar' })).toBeVisible();
    });

    await test.step('Navigate to API and verify target page', async () => {
      await homePage.clickAPI();
      await expect(page).toHaveURL(testData.urls.api);
      // TC-001 Step 10: primary heading confirms correct page loaded
      await expect(page.getByRole('heading', { name: 'Playwright Library', level: 1 })).toBeVisible();
      // TC-001 Step 11: verify API sidebar is rendered, confirming full page content loaded
      await expect(page.getByRole('navigation', { name: 'Docs sidebar' })).toBeVisible();
    });

    await test.step('Navigate to Community and verify target page', async () => {
      await homePage.clickCommunity();
      await expect(page).toHaveURL(testData.urls.community);
      // TC-001 Step 13: primary heading confirms correct page loaded
      await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();
      // TC-001 Step 14: verify community page lists expected channels
      await expect(page.getByRole('link', { name: 'Discord Server', exact: true })).toBeVisible();
    });

    await test.step('Return to homepage and verify all buttons remain functional', async () => {
      await homePage.goto();
      await expect(homePage.navigationMenu).toBeVisible();
      await homePage.expectNavLinksAccessible();
    });
  });

  /**
   * TC-002 Edge Case: Navigation link state persistence on inner pages
   *
   * Manual Test Case Reference: docs/manual.test.cases.refactoring.md — TC-002
   * Guards against regressions where the navigation bar collapses or links
   * become hidden/disabled after the user navigates away from the homepage.
   * Covers Finding 2.2 (edge cases) from quality-review.md.
   */
  test('TC-002 - should keep navigation links visible and enabled on destination pages', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);

    await test.step('Navigate to Docs page and verify nav links remain visible and enabled', async () => {
      await homePage.goto();
      await homePage.clickDocs();
      // Edge case: nav links must stay visible and interactive on inner pages (not collapsed/aria-disabled)
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to API page and verify nav links remain visible and enabled', async () => {
      await homePage.goto();
      await homePage.clickAPI();
      // Confirm no hidden/aria-disabled state after navigating between inner pages
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to Community page and verify nav links remain visible and enabled', async () => {
      await homePage.goto();
      await homePage.clickCommunity();
      // Confirm no hidden/aria-disabled state on the Community destination page
      await homePage.expectNavLinksAccessible();
    });
  });

  /**
   * TC-003: Negative — Network Failure Recovery
   *
   * Manual Test Case Reference: docs/manual.test.cases.refactoring.md — TC-003
   * Covers Finding 2.1 (network failures) and Finding 2.3 (error handling)
   * from quality-review.md.
   * Simulates a network disconnection while the user attempts navigation and
   * verifies the site recovers cleanly once the connection is restored.
   */
  test('TC-003 - should handle a simulated network failure gracefully and recover to a working state', async ({ page, context }) => {
    const homePage = new PlaywrightHomePage(page);

    await test.step('Navigate to homepage while online', async () => {
      await homePage.goto();
    });

    await test.step('Simulate network disconnection and attempt to navigate to Docs', async () => {
      await context.setOffline(true);

      // Navigate directly to Docs page
      const response = await page.goto(testData.paths.docsIntro).catch(() => null);

      // Check 1: network-level failure — response must be null (ERR_INTERNET_DISCONNECTED / NS_ERROR_OFFLINE etc.)
      expect(response).toBeNull();

      // Check 2: URL must not have advanced to the Docs destination
      expect(page.url()).not.toMatch(testData.urls.docs);

      // Check 3: the Docs destination content must be absent — confirms the user is NOT on the target page
      await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).not.toBeVisible();
    });

    await test.step('Restore network connection and verify full recovery', async () => {
      await context.setOffline(false);
      await homePage.goto();
      // Site must be fully functional again after network restoration
      await homePage.expectNavLinksAccessible();
    });
  });
});
