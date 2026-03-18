import { type Locator, type Page } from '@playwright/test';

export class Header {
  constructor(private readonly page: Page) {}

  public cartBadge(): Locator {
    return this.page.getByTestId('cart-badge');
  }
}
