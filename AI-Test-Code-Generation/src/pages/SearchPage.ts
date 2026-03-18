import { type Locator, type Page } from '@playwright/test';

export class SearchPage {
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto('/search');
  }

  public queryInput(): Locator {
    return this.page.getByLabel('Search');
  }

  public submit(): Locator {
    return this.page.getByRole('button', { name: /search/i });
  }

  public async search(query: string): Promise<void> {
    await this.queryInput().fill(query);
    await this.submit().click();
  }

  public async applyFilter(filterName: string): Promise<void> {
    await this.page.getByRole('button', { name: filterName }).click();
  }

  public productResult(name: string): Locator {
    return this.page.getByRole('link', { name });
  }
}
