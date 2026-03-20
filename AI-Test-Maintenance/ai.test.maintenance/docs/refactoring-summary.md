# Refactoring Summary

**Original:** `tests/e2e/main.navigation.spec.ts`
**Refactored:** `tests/e2e/main.navigation.refactored.spec.ts`
**Page Object Updated:** `src/pages/PlaywrightHomePage.ts`
**Analysis Reference:** `docs/legacy-test-analysis.md`

## Side-by-Side Comparison

| Aspect | Degraded | AI-Refactored | Manual Improvement |
|--------|----------|---------------|-------------------|
| **Synchronization** | `waitForTimeout(2000)` hard-coded | `toHaveURL()` auto-retry assertions | — (covered by AI step) |
| **Accessibility – API link** | Missing `toHaveAccessibleName`; duplicate `toBeVisible` | Consistent assertions for all 3 links | `expectNavLinksAccessible()` POM method loops all 3 links uniformly |
| **API heading assertion** | Commented out; fell back to `page.locator('h1')` | `getByRole('heading', { name: 'Playwright Library', level: 1 })` — consistent with Docs and Community | — |
| **Navigation context** | Not validated | `navigationMenu` visibility asserted | — |
| **Post-nav state (Step 17)** | Not validated | Full accessibility re-check after each return | Reuses POM method — single line per re-check |
| **Test structure** | Flat, no grouping | `test.step()` blocks mapped to TC001 steps | — |
| **Code duplication** | 4-line assertion block repeated 3×+ | Calls `homePage.expectNavLinksAccessible()` | New POM method eliminates all in-test duplication |

## What Changed and Why

### 1. Removed `waitForTimeout(2000)` → Flakiness fix
The hard-coded timeout was the single biggest flakiness risk. Replaced with Playwright's built-in auto-retry in `toHaveURL()`, which waits only as long as needed and fails deterministically on timeout.

### 2. Fixed API link accessibility gap → Coverage fix
The original was missing `toHaveAccessibleName('API')` and had a duplicate `toBeVisible()` call instead. Both issues are eliminated by the shared `expectNavLinksAccessible()` loop.

### 3. Replaced CSS `h1` selector → Selector quality fix
`page.locator('h1')` was swapped for `page.getByRole('heading', { name: 'Playwright Library', level: 1 })` — a semantic, accessibility-tree-based locator consistent with the Docs and Community heading assertions.

### 4. Added `test.step()` blocks → Readability fix
Each phase (initial validation, navigate Docs, return, navigate API, etc.) is wrapped in a named step that maps directly to TC001 manual test case steps.

### 5. Added navigation menu context assertion → Coverage gap
Validates the `<nav>` landmark exists before and after the navigation cycle, addressing manual test Step 2.

### 6. Added post-navigation state validation → Coverage gap
After every return to the homepage, all three links are re-validated for visibility, role, accessible name, and enabled state. This covers manual test Steps 11, 14, and 17.

### 7. `expectNavLinksAccessible()` POM method → Manual improvement (duplication + accessibility)
Moved the repeated 4-assertion-per-link pattern into a single Page Object method. This:
- Eliminates 12+ duplicated assertion lines
- Guarantees uniform ARIA role and accessible name checks
- Makes future additions (e.g., a new nav link) a one-line change

## Risk Reduction

| Risk | Before | After |
|------|--------|-------|
| Flakiness | **High** — timing-dependent | **Low** — event-driven waits |
| Maintenance | **Medium-High** — duplication, inconsistency | **Low** — single POM method, `test.step` structure |
| Coverage | **Medium** — missing accessibility + post-nav checks | **Low** — full TC001 compliance |
