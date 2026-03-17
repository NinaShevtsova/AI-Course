import { BaseComponent } from './BaseComponent';

/**
 * Header component object containing header-specific actions.
 */
export class HeaderComponent extends BaseComponent {
  /**
   * Clicks the sign in action in the header.
   */
  public async clickSignIn(): Promise<void> {
    await this.getByRole('button', { name: 'Sign in' }).click();
  }

  /**
   * Opens the primary navigation menu.
   */
  public async openMainMenu(): Promise<void> {
    await this.getByRole('button', { name: 'Menu' }).click();
  }
}
