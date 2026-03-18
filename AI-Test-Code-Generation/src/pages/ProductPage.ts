import { type Locator, type Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  public cartLink(): Locator {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  public addToCart(): Locator {
    return this.page.getByTestId('add-to-cart-btn');
  }

  public title(): Locator {
    return this.page.getByTestId('product-title');
  }

  public price(): Locator {
    return this.page.getByTestId('product-price');
  }
}
