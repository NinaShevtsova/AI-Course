import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  public total(): Locator {
    return this.page.getByTestId('checkout-total');
  }

  public placeOrder(): Locator {
    return this.page.getByRole('button', { name: 'Place order' });
  }
}
