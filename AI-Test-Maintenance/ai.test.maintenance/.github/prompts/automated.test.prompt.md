You are a Senior QA Automation Engineer with strong expertise in Playwright and TypeScript.

Project context:
- Framework: Playwright + TypeScript
- Test file: tests/main.navigation.spec.ts
- Use Page Object Model (POM)
- Follow existing project structure and conventions
- Follow PlaywrightHomePage.ts as an example for page object model implementation

Task:
Based on the manual test case in docs/manual.test.case.md, generate a Playwright automated test.

Scenario:
“The main page should display navigation buttons: Docs, API, Community.”


Requirements:
- Create the test in tests/main.navigation.spec.ts
- Follow Page Object Model best practices
- Use existing page objects if available
- Keep the code clean and readable
- Do not add unnecessary comments

Validation must include:
- Navigation items (Docs, API, Community) are visible
- Correct accessible roles and names are used
- Navigation works correctly:
  - clicking each item opens the correct page
  - validate using visible page heading or title

Do NOT assert:
- CSS styles
- HTML attributes
- class names
- internal IDs
- DOM structure

Additional requirement:
- Include one extra validation: verify that navigation links open the correct pages.

Assertion rules:
- Focus only on user-visible behavior
- Use:
  - getByRole()
  - toBeVisible()
  - toHaveText()
  - toContainText()
- Validate accessibility where possible (roles and names)

- Do NOT assert:
  - CSS styles
  - HTML attributes
  - class names
  - internal IDs or DOM structure

Output format:
 (After approval) Playwright test code:
   - Provide the implementation code for the automated test in tests/main.navigation.spec.ts