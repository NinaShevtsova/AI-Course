import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages/PlaywrightHomePage.js';

test.describe('Playwright website', () => {
  test('has title', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    await homePage.goto();
    
    // Verify page title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Verify main elements are visible
    await expect(homePage.title).toBeVisible();
    await expect(homePage.getStartedButton).toBeVisible();
    await expect(homePage.navigationMenu).toBeVisible();
  });

   test('should navigate to documentation when clicking Get Started', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    await homePage.goto();
    await homePage.clickGetStarted();
    
    // Verify navigation to documentation worked after clicking Get Started
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(/Installation|Introduction/);
  });
});
