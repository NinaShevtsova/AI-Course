import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

type DropdownOption = 'Edit' | 'Delete' | 'Archive';

/**
 * Refactored page object that uses one parameterized dropdown action.
 */
export class RefactoringNeedsPageRefactored extends BasePage {
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
   * Returns a menu action by visible option text.
   */
  private dropdownOption(option: DropdownOption): Locator {
    return this.page.getByRole('menuitem', { name: option }).first();
  }

  /**
   * Opens dropdown and clicks an option by visible name.
   */
  public async clickDropdownByName(option: DropdownOption): Promise<void> {
    await this.waitAndClick(this.dropdownToggle());
    await this.waitAndClick(this.dropdownOption(option));
  }
}
