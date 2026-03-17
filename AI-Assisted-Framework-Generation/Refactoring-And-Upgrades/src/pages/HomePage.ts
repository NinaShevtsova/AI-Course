import { expect, type Page } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { BasePage } from './BasePage';

/**
 * Home page object with high-level page workflows.
 */
export class HomePage extends BasePage {
  public readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  /**
   * Opens the application home page.
   */
  public async open(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Searches for content using the search field.
   */
  public async searchFor(query: string): Promise<void> {
    await this.fillByLabel('Search', query);
    await this.clickByRole('button', { name: 'Search' });
  }

  /**
   * Verifies the home page is loaded.
   */
  public async expectLoaded(): Promise<void> {
    await expect(this.getByRole('heading', { name: 'Home' })).toBeVisible();
  }
}
