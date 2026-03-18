import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  public items(): Locator {
    return this.page.getByTestId('cart-item');
  }

  public proceedToCheckout(): Locator {
    return this.page.getByTestId('checkout-btn');
  }
}
