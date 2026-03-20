# Reflection — Chapter 4: AI-Assisted Test Refactoring

---

**1. Which professional criteria did AI satisfy vs. which needed your edits?**

AI satisfied: `test.step()` structure, POM usage, role-based locators, test ID traceability (`TC-001/002/003`), and inline comments tied to manual test steps.
---

**2. What prompt changes improved AI's proposals the most?**

- Referencing numbered manual test case steps ("Step 8: sidebar check") anchored assertions to real acceptance criteria
- Providing quality-review finding IDs ("cover Finding 2.1, 2.3") produced targeted negative tests instead of generic smoke checks
- Pasting the exact Playwright error message let AI pinpoint the fix immediately; vague descriptions did not

---

**3. What review rules will you codify (naming, assertions, POM usage) for team PRs?**

- **Naming:** `TC-XXX - should <behaviour>` format is mandatory
- **Assertions:** URL + `<h1>` required on every nav check; sidebar for docs pages; offline checks use `response === null` + URL mismatch + content absence
- **POM:** locators scoped to `Main` landmark + `exact: true`; use shared helpers, no inline duplication; verify locators on inner pages before merge
