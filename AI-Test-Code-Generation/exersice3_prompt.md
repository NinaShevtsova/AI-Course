# Exercise 3 - Prompt

You are an experienced Senior QA Automation Engineer with expertise in TypeScript and Playwright E2E testing

Extend the existing framework with the tests adding fiLes to a target repository:
Project & framework:

Stack: TypeScript + Playwright

File structure
tests/e2e/search.spec.ts
src/pages/SearchPage.ts
src/pages/ResultsPage.ts

Optional DOM context (outerHTML):
<div role="list" data-testid="results"> <div data-testid="result-item"> <span class="title">Laptop</span> <span class="price">$999</span> </div> </div>
Task:

Page Objects:

SearchPage:
queryInput(): Locator
submit(): Promise<void>
applyFilter(filterName: string): Promise<void>

ResultsPage:
items(): Locator
titleOf(index: number): Promise<string>
priceOf(index: number): Promise<number>

Test (search.spec):
// Initialization: open search page
// User actions: type "Laptop", apply filter "Price < $1000"
// Verification: each result price < 1000


- Use getByRole, getByTestId, or getByLabel for selectors
- Assertions: use Playwright web-first assertions (toBeVisible, toHaveText, toHaveURL).
- Do not hardcode waits or timeouts; rely on built-in waits.
- Follow the Page Object / Component Object pattern by placing locators and actions inside classes rather than tests. Use testData.ts for product details, totals, and pricing instead of hardcoding values