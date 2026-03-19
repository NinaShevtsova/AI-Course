import { test, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../../src/pages/PlaywrightHomePage.js';
import { BASE_URL } from '../../src/constants/baseUrl.js';

test.describe('Main Navigation', () => {
  test('should display and function navigation buttons: Docs, API, Community', async ({ page }) => {
    const homePage = new PlaywrightHomePage(page);
    
    await homePage.goto();
    
    // Accessibility & Role Validation
    await expect(homePage.docsLink).toBeVisible();
    await expect(homePage.docsLink).toHaveRole('link');
    await expect(homePage.docsLink).toHaveAccessibleName('Docs');
    await expect(homePage.docsLink).toBeEnabled();
    
    await expect(homePage.apiLink).toBeVisible();
    await expect(homePage.apiLink).toHaveRole('link');
    await expect(homePage.apiLink).toHaveAccessibleName('API');
    await expect(homePage.apiLink).toBeEnabled();
    
    await expect(homePage.communityLink).toBeVisible();
    await expect(homePage.communityLink).toHaveRole('link');
    await expect(homePage.communityLink).toHaveAccessibleName('Community');
    await expect(homePage.communityLink).toBeEnabled();
    
    // Test Navigation 
    // Docs link opens the correct page
    await homePage.clickDocs();
    await expect(page).toHaveURL(/\/docs\/intro/);
    await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
    
    await homePage.goto();
    
    // API link opens the correct page
    await homePage.clickAPI();
    await expect(page).toHaveURL(/\/docs\/api\//);
    await expect(page.getByRole('heading', { name: 'Playwright Library', level: 1 })).toBeVisible();
    
    await homePage.goto();
    
    // Community link opens the correct page
    await homePage.clickCommunity();
    await expect(page).toHaveURL(/\/community\//);
    await expect(page.getByRole('heading', { name: 'Welcome', level: 1 })).toBeVisible();
  });
});
