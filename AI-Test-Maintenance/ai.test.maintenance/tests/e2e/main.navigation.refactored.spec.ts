import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages/PlaywrightHomePage.js';
import { testData } from '../../src/fixtures/testData.js';

test.describe('Main Navigation', () => {
  test('should display and function navigation buttons: Docs, API, Community', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);

    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });

    await test.step('Verify all navigation links are visible and accessible', async () => {
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to Docs and verify target page', async () => {
      await homePage.clickDocs();
      await expect(page).toHaveURL(testData.urls.docs);
      await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
    });

    await test.step('Return to homepage and verify navigation state', async () => {
      await homePage.goto();
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to API and verify target page', async () => {
      await homePage.clickAPI();
      await expect(page).toHaveURL(testData.urls.api);
      await expect(page.getByRole('heading', { name: 'Playwright Library', level: 1 })).toBeVisible();
    });

    await test.step('Return to homepage and verify navigation state', async () => {
      await homePage.goto();
      await homePage.expectNavLinksAccessible();
    });

    await test.step('Navigate to Community and verify target page', async () => {
      await homePage.clickCommunity();
      await expect(page).toHaveURL(testData.urls.community);
      await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();
    });

    await test.step('Return to homepage and verify all buttons remain functional', async () => {
      await homePage.goto();
      await expect(homePage.navigationMenu).toBeVisible();
      await homePage.expectNavLinksAccessible();
    });
  });
});
