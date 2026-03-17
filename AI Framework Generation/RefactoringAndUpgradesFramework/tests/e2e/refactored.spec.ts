import { expect, test } from '../../src/fixtures/BaseTest';
import { RefactoringNeedsPageRefactored } from '../../src/pages/RefactoringNeedsPageRefactored';

/**
 * Coverage for the refactored dropdown actions page object.
 */
test.describe('RefactoringNeedsPageRefactored', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <button type="button" data-testid="dropdown-button" aria-haspopup="menu" aria-expanded="false">
        Actions
      </button>
      <div role="menu" hidden>
        <button type="button" role="menuitem">Edit</button>
        <button type="button" role="menuitem">Delete</button>
        <button type="button" role="menuitem">Archive</button>
      </div>
      <div role="status" data-testid="selected-action"></div>
      <script>
        const dropdownButton = document.querySelector('[data-testid="dropdown-button"]');
        const menu = document.querySelector('[role="menu"]');
        const status = document.querySelector('[data-testid="selected-action"]');
        const items = Array.from(document.querySelectorAll('[role="menuitem"]'));

        dropdownButton.addEventListener('click', () => {
          const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
          dropdownButton.setAttribute('aria-expanded', String(!isExpanded));
          menu.hidden = isExpanded;
        });

        for (const item of items) {
          item.addEventListener('click', () => {
            status.textContent = item.textContent || '';
            dropdownButton.setAttribute('aria-expanded', 'false');
            menu.hidden = true;
          });
        }
      </script>
    `);
  });

  test('should click Edit from dropdown', async ({ page }) => {
    const refactoringNeedsPage = new RefactoringNeedsPageRefactored(page);

    await refactoringNeedsPage.clickDropdownByName('Edit');

    await expect(page.getByTestId('selected-action')).toHaveText('Edit');
  });

  test('should click Delete from dropdown', async ({ page }) => {
    const refactoringNeedsPage = new RefactoringNeedsPageRefactored(page);

    await refactoringNeedsPage.clickDropdownByName('Delete');

    await expect(page.getByTestId('selected-action')).toHaveText('Delete');
  });

  test('should click Archive from dropdown', async ({ page }) => {
    const refactoringNeedsPage = new RefactoringNeedsPageRefactored(page);

    await refactoringNeedsPage.clickDropdownByName('Archive');

    await expect(page.getByTestId('selected-action')).toHaveText('Archive');
  });
});
