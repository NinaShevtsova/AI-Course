import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages/PlaywrightHomePage.js';

test.describe('Main Navigation', () => {
  test('should display and function navigation buttons: Docs, API, Community', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    await homePage.goto();
    
    await expect(homePage.docsLink).toBeVisible();
    await expect(homePage.apiLink).toBeVisible();
    await expect(homePage.communityLink).toBeVisible();
    
    await homePage.clickDocs();
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
    await expect(homePage.navigationMenu).toBeVisible();
    
    await homePage.goto();
    
    await homePage.clickAPI();
    await expect(page).toHaveURL(/\/docs\/api\//);
    await expect(page.getByRole('heading', { name: 'Playwright Library', level: 1 })).toBeVisible();
    await homePage.goto();
    
    await homePage.clickCommunity();
    await expect(page).toHaveURL(/\/community\//);
    await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();
    });
});
