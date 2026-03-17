import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page object for dropdown actions used in refactoring scenarios.
 */
export class RefactoringNeedsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Returns the control that opens dropdown actions.
   */
  private dropdownToggle(): Locator {
    return this.page.getByTestId('dropdown-button').first();
  }

  /**
   * Returns a menu action by visible name.
   */
  private dropdownAction(name: 'Edit' | 'Delete' | 'Archive'): Locator {
    return this.page.getByRole('menuitem', { name }).first();
  }

  /**
   * Opens the dropdown and clicks selected action.
   */
  private async clickDropdownAction(name: 'Edit' | 'Delete' | 'Archive'): Promise<void> {
    await this.waitAndClick(this.dropdownToggle());
    await this.waitAndClick(this.dropdownAction(name));
  }

  /**
   * Clicks the Edit action in a dropdown menu.
   */
  public async clickDropdownEdit(): Promise<void> {
    await this.clickDropdownAction('Edit');
  }

  /**
   * Clicks the Delete action in a dropdown menu.
   */
  public async clickDropdownDelete(): Promise<void> {
    await this.clickDropdownAction('Delete');
  }

  /**
   * Clicks the Archive action in a dropdown menu.
   */
  public async clickDropdownArchive(): Promise<void> {
    await this.clickDropdownAction('Archive');
  }
}
