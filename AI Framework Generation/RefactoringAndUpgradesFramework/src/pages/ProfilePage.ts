import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Profile page object with avatar management workflows.
 */
export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Opens the profile page.
   */
  public async open(): Promise<void> {
    await this.navigateTo('/profile');
  }

  /**
   * Uploads a new avatar image and saves the profile form.
   */
  public async updateAvatar(imagePath: string): Promise<void> {
    await this.getByTestId('avatar-upload').setInputFiles(imagePath);
    await this.clickByTestId('submit-btn');
  }

  /**
   * Updates the username field and saves profile changes.
   */
  public async updateUsername(username: string): Promise<void> {
    await this.clearAndFillByLabel('Username', username);
    await this.clickByTestId('submit-btn');
  }

  /**
   * Updates the email field and saves profile changes.
   */
  public async updateEmail(email: string): Promise<void> {
    await this.clearAndFillByLabel('Email', email);
    await this.clickByTestId('submit-btn');
  }

  /**
   * Updates the account password and saves profile changes.
   */
  public async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.clearAndFillByLabel('Current password', currentPassword);
    await this.clearAndFillByLabel('New password', newPassword);
    await this.clickByTestId('submit-btn');
  }

  /**
   * Removes the current avatar and saves profile changes.
   */
  public async removeAvatar(): Promise<void> {
    await this.clickByTestId('remove-avatar-btn');
    await this.clickByTestId('submit-btn');
  }

  /**
   * Verifies a profile field has the expected value.
   */
  public async verifyProfileField(fieldLabel: string, expectedValue: string): Promise<void> {
    await expect(this.getByLabel(fieldLabel)).toHaveValue(expectedValue);
  }

  /**
   * Verifies the default avatar image is displayed.
   */
  public async verifyDefaultAvatar(): Promise<void> {
    await expect(this.getByTestId('avatar-image')).toHaveAttribute('src', /default|placeholder/i);
  }

  /**
   * Verifies avatar update success feedback is visible.
   */
  public async verifyUpdateSuccess(): Promise<void> {
    await expect(this.getByRole('status', { name: 'Profile updated successfully' })).toBeVisible();
  }
}
