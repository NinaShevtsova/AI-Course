# Exercise 1 - Prompt

You are an experienced Senior QA Automation Engineer with expertise in TypeScript and Playwright E2E testing
Write concise, technical TypeScript framework code with correct types.

Project & framework:

Stack: TypeScript + Playwright
Patterns: Page Object / Component Object. Locators/actions live in classes, not inside tests.
Selectors: Prefer getByRole/getByLabel/getByTestId; avoid complex CSS/XPath.
Structure:
tests/e2e/auth.spec.{{ext}}
src/pages/AuthPage.{{ext}}, src/pages/HomePage.{{ext}}
src/fixtures/testData.{{ext}}
Optional DOM context (outerHTML):
<form>
<label for="username">Username</label>
<input id="username" data-testid="username-input" />
<label for="password">Password</label>
<input id="password" data-testid="password-input" type="password" />
<button type="submit" data-testid="login-btn">Sign in</button>

</form>

Rules (apply in generated code):

Descriptive test names reflecting expected behavior.
Use Playwright fixtures (test, page, expect); ensure isolation.
Use test.beforeEach/test.afterEach if setup/teardown is needed.
Keep tests DRY: extract reusable logic into helpers or page/component methods.
Reuse Playwright locators via getters/fields; no raw page.locator in tests.
Use web-first assertions (toBeVisible, toHaveText, toHaveURL, etc.).
Avoid hard-coded timeouts; rely on built-in waits.
Ensure parallel-safe code, no shared mutable state.
Add JSDoc for helper functions and reusable logic.
If a Page Object already exists in the repo, import it instead of creating a duplicate.
Follow https://playwright.dev/docs/writing-tests guidance.
Task:
Task:

AuthPage:
open()
username()
password()
submit()
errorMessage()
login(user, pass)
HomePage:
avatar()
Test (auth.spec):
// Initialization: open login
// User actions: fill credentials, submit
// Verification: successful login → avatar visible
// User actions: invalid login
// Verification: error message visible
