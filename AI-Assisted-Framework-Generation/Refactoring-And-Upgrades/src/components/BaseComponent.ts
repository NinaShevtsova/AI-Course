import { type Locator, type Page } from '@playwright/test';

/**
 * Base component with reusable component-level interactions.
 */
export class BaseComponent {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Finds an element by role within the page.
   */
  public getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Finds an element by label within the page.
   */
  public getByLabel(
    text: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1],
  ): Locator {
    return this.page.getByLabel(text, options);
  }

  /**
   * Finds an element by test id within the page.
   */
  public getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
