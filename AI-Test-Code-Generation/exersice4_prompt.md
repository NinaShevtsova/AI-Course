# Exercise 4 - Prompt

You are a Senior QA Automation Engineer.

Goal: Update a single locator in an existing Page Object without modifying any other code.

Project:
Folder: AI-Test-Code-Generation
Stack: TypeScript + Playwright

you need to fix:
// path: src/pages/ProductPage.ts

public addToCart(): Locator {
  return this.page.getByRole('button', { name: 'Add to cart' });
}
Problem:

The current locator is outdated. The button now has a data-testid="add-to-cart-btn".
Our convention is to use stable selectors (e.g., data-testid) in Page Objects.

Fix:
Replace the locator with the data-testid equivalent
Keep method signature unchanged
Do not modify any other code
