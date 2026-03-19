You are a Senior QA Automation Engineer with strong expertise in Playwright and TypeScript.

Project context:
- Application under test: https://playwright.dev
- The goal is to create a high-quality manual test case

Task:
Generate a manual test case for the following scenario:

“The main page should display navigation buttons: Docs, API, Community.”

Requirements for manual test case:
- First, generate a manual test case in a clear step-by-step format.
- Include Preconditions as the first step (browser, URL, initial state).
- Cover all user interactions in logical order.
- Use a structured format (steps with actions and expected results).
- Use the following columns: Step | Action | Expected Result
- Expected results must validate:
  - visibility (element is visible on the page)
  - correct accessible role (e.g., link, navigation item)
  - accessible name/label (Docs, API, Community)
- Include post-navigation validation:
  - when a navigation item is clicked, verify the correct page opens
  - validate using visible indicators such as page heading or title
- Do NOT include any code.

Expected results must validate:
- Visibility: each navigation item is visible on the page
- Accessibility:
  - correct role (e.g., link)
  - correct accessible name (Docs, API, Community)

Post-navigation validation:
- For each navigation item (Docs, API, Community):
  - include steps where the user clicks it
  - verify that the correct page opens
  - validate using visible page elements such as heading or page title

Rules:
- Do NOT include any code
- Do NOT include selectors or technical implementation details
- Focus only on user behavior and observable results

Output format:

Manual test case:
   - Provide the test case in a structured table format with the following columns:
     | Step | Action | Expected Result |
   - Ensure the table is complete, consistent, and easy to read.

