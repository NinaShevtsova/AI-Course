import { type Locator, type Page } from '@playwright/test';

export class ResultsPage {
  constructor(private readonly page: Page) {}

  public items(): Locator {
    return this.page.getByTestId('result-item');
  }

  public async titleOf(index: number): Promise<string> {
    return (await this.items().nth(index).getByTestId('result-title').textContent())?.trim() ?? '';
  }

  public async priceOf(index: number): Promise<number> {
    const value = (await this.items().nth(index).getByTestId('result-price').textContent())?.trim() ?? '';
    return Number(value.replace('$', ''));
  }

  public async getAllPrices(): Promise<number[]> {
    const values = await this.items().getByTestId('result-price').allTextContents();
    return values.map((value) => Number(value.trim().replace('$', '')));
  }
}