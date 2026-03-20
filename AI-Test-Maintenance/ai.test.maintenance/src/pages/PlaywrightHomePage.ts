import { Page, Locator, expect } from '@playwright/test';
import { BASE_URL } from '../constants/baseUrl.js';

export class PlaywrightHomePage {
  readonly page: Page;
  readonly getStartedButton: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;
  readonly title: Locator;
  readonly navigationMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.apiLink = page.getByRole('link', { name: 'API' });
    this.communityLink = page.getByRole('link', { name: 'Community' });
    this.title = page.getByRole('heading', { level: 1 }).first();
    this.navigationMenu = page.getByRole('navigation', { name: 'Main' });
  }

  get installationHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Installation', level: 1 });
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async clickDocs() {
    await this.docsLink.click();
  }

  async clickAPI() {
    await this.apiLink.click();
  }

  async clickCommunity() {
    await this.communityLink.click();
  }

  /**
   * Validates that all navigation links (Docs, API, Community) are visible,
   * have the correct ARIA role, accessible name, and are enabled.
   * Consolidates the repeated accessibility assertion pattern.
   */
  async expectNavLinksAccessible() {
    const navLinks = [
      { locator: this.docsLink, name: 'Docs' },
      { locator: this.apiLink, name: 'API' },
      { locator: this.communityLink, name: 'Community' },
    ];

    for (const { locator, name } of navLinks) {
      await expect(locator).toBeVisible();
      await expect(locator).toHaveRole('link');
      await expect(locator).toHaveAccessibleName(name);
      await expect(locator).toBeEnabled();
    }
  }
}
