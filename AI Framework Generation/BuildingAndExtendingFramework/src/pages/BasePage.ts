import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Base page that centralizes common browser and selector interactions.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a target URL.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits until the page network is idle.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Waits until the provided locator becomes visible.
   */
  public async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Waits until the provided locator becomes hidden.
   */
  public async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Waits for a locator to become visible and then clicks it.
   */
  public async waitAndClick(locator: Locator, timeout?: number): Promise<void> {
    await this.waitForVisible(locator, timeout);
    await locator.click();
  }

  /**
   * Selects an option in a select element by visible label.
   */
  public async selectOptionByLabel(locator: Locator, label: string): Promise<void> {
    await locator.selectOption({ label });
  }

  /**
   * Clears an input field and fills it with a new value.
   */
  public async clearAndFill(locator: Locator, value: string): Promise<void> {
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Waits for an element found by test id to become visible and then clicks it.
   */
  public async waitAndClickByTestId(testId: string, timeout?: number): Promise<void> {
    await this.waitAndClick(this.getByTestId(testId), timeout);
  }

  /**
   * Clears an input found by label and fills it with a new value.
   */
  public async clearAndFillByLabel(
    text: Parameters<Page['getByLabel']>[0],
    value: string,
    options?: Parameters<Page['getByLabel']>[1],
  ): Promise<void> {
    await this.clearAndFill(this.getByLabel(text, options), value);
  }

  /**
   * Selects a visible option label in a select field found by label.
   */
  public async selectOptionByFieldLabel(
    text: Parameters<Page['getByLabel']>[0],
    optionLabel: string,
    options?: Parameters<Page['getByLabel']>[1],
  ): Promise<void> {
    await this.selectOptionByLabel(this.getByLabel(text, options), optionLabel);
  }

  /**
   * Finds an element by accessible role.
   */
  public getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Finds an element by associated label text.
   */
  public getByLabel(
    text: Parameters<Page['getByLabel']>[0],
    options?: Parameters<Page['getByLabel']>[1],
  ): Locator {
    return this.page.getByLabel(text, options);
  }

  /**
   * Finds an element by test id.
   */
  public getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Clicks an element found by role.
   */
  async clickByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Promise<void> {
    await this.getByRole(role, options).click();
  }

  /**
   * Fills an input found by label.
   */
  async fillByLabel(
    text: Parameters<Page['getByLabel']>[0],
    value: string,
    options?: Parameters<Page['getByLabel']>[1],
  ): Promise<void> {
    await this.getByLabel(text, options).fill(value);
  }

  /**
   * Clicks an element found by test id.
   */
  async clickByTestId(testId: string): Promise<void> {
    await this.getByTestId(testId).click();
  }

  /**
   * Verifies a role-based element is visible.
   */
  async expectByRoleVisible(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Promise<void> {
    await expect(this.getByRole(role, options)).toBeVisible();
  }
}
