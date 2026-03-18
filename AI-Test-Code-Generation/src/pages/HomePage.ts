import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  public avatar(): Locator {
    return this.page.getByTestId('user-avatar');
  }
}
