# AI-Test-Code-Generation

Playwright E2E test framework built with TypeScript following Page Object Model (POM) and Component Object Model (COM) patterns.

## Stack

- TypeScript + Playwright
- Fixture-based test data (no hardcoded values in tests)
- DOM route mocking via `page.route()` for full test isolation

## Project Structure

```
src/
  components/
    Header.ts              # Cart badge locator
  fixtures/
    testData.ts            # getAuthTestData(), getCheckoutTestData(), getSearchTestData()
  pages/
    AuthPage.ts            # open(), username(), password(), submit(), errorMessage(), login()
    CartPage.ts            # items(), proceedToCheckout()
    CheckoutPage.ts        # total(), placeOrder()
    HomePage.ts            # avatar()
    ProductPage.ts         # addToCart(), cartLink(), title(), price()
    ResultsPage.ts         # items(), titleOf(), priceOf(), getAllPrices()
    SearchPage.ts          # open(), queryInput(), submit(), search(), applyFilter(), productResult()
  utils/
    DateHelper.ts          # formatLocalDate() — safe date formatter (returns "" on null/undefined)
tests/
  e2e/
    auth.spec.ts           # Valid login, invalid login, and empty credentials validation
    checkout.spec.ts       # End-to-end cart to checkout flow with place order assertion
    search.spec.ts         # Search + price filter with explicit filtered-out item verification
playwright.config.ts
```

## Running Tests

```bash
# All tests
npx playwright test

# Specific spec
npx playwright test tests/e2e/auth.spec.ts
npx playwright test tests/e2e/checkout.spec.ts
npx playwright test tests/e2e/search.spec.ts
```

## Key Conventions

- Selectors: `getByRole`, `getByLabel`, `getByTestId` — no CSS or XPath
- Assertions: web-first (`toBeVisible`, `toHaveText`, `toHaveURL`, `toHaveCount`)
- No `waitForTimeout` or fixed waits
- All test data sourced from `src/fixtures/testData.ts`
- Locators and actions live in Page Objects, not in test files

## Current Suite

- auth: 3 tests
- checkout: 1 test
- search: 1 test
- total: 5 tests
