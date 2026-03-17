import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login page object with authentication workflows.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Opens the login page.
   */
  public async open(): Promise<void> {
    await this.navigateTo('/login');
  }

  /**
   * Fills the username field.
   */
  public async fillUsername(username: string): Promise<void> {
    await this.clearAndFillByLabel('Email', username);
  }

  /**
   * Fills the password field.
   */
  public async fillPassword(password: string): Promise<void> {
    await this.clearAndFillByLabel('Password', password);
  }

  /**
   * Clicks the login action.
   */
  public async clickLogin(): Promise<void> {
    await this.clickByRole('button', { name: 'Sign in' });
  }

  /**
   * Logs in with valid user credentials.
   */
  public async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Verifies login completed successfully.
   */
  public async verifyLoginSuccess(): Promise<void> {
    await expect(this.getByRole('heading', { name: 'Home' })).toBeVisible();
  }

  /**
   * Verifies an authentication error message is displayed.
   */
  public async verifyErrorMessage(message: string): Promise<void> {
    await expect(this.getByRole('alert')).toContainText(message);
  }

  /**
   * Verifies a field-level validation message is exposed for the given field.
   */
  public async verifyFieldValidation(fieldLabel: string, message: string): Promise<void> {
    await expect(this.getByLabel(fieldLabel)).toHaveAccessibleDescription(message);
  }
}
