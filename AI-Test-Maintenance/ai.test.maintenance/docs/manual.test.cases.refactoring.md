# Manual Test Cases: Refactored Navigation

> This file contains refactored/extended manual test cases that correspond to
> `tests/e2e/main.navigation.professional.spec.ts`.  
> The original baseline TC-001 lives in `docs/manual.test.case.md`.  
> TC-001 below is an **extended revision** that adds sidebar and content
> verification steps (Steps 8, 11, 14) missing from the original.

---

# TC-001 (Extended) — Main Navigation: Full Destination Page Verification

**Test Case ID:** TC-001  
**Test Case Title:** Verify navigation links route to correct destination pages with full content loaded  
**Application Under Test:** https://playwright.dev  
**Related Automated Test:** `tests/e2e/main.navigation.professional.spec.ts` — `should validate complete navigation workflow including accessibility and state preservation`  
**Supersedes:** `docs/manual.test.case.md` TC001 (original — Steps 1–17, no sidebar/content checks)

---

## Manual Test Case:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | **Preconditions:** Open a web browser (Chrome, Firefox, or Edge) and navigate to https://playwright.dev | The Playwright homepage loads successfully. The main navigation bar is visible at the top of the page |
| 2 | Locate the main navigation area at the top of the page | The navigation menu landmark is visible and contains multiple items |
| 3 | Verify the **Docs** navigation link is present | The Docs link is clearly visible with readable text |
| 4 | Verify the **API** navigation link is present | The API link is clearly visible with readable text |
| 5 | Verify the **Community** navigation link is present | The Community link is clearly visible with readable text |
| 6 | Inspect all three links for accessibility: role, label, interactive state | All three items appear as clickable links; each has a correct accessible label and is not disabled |
| 7 | Click the **Docs** navigation link | The browser navigates to the Docs section. URL contains `/docs/intro`. The primary heading **"Installation"** is visible |
| 8 | Without navigating away, inspect the left-hand sidebar | The **Docs sidebar** navigation panel is visible on the left side, listing documentation sections. Confirms the full page rendered, not just the heading |
| 9 | Navigate back to https://playwright.dev | The homepage loads again with all three navigation links visible |
| 10 | Click the **API** navigation link | The browser navigates to the API section. URL contains `/docs/api`. The primary heading **"Playwright Library"** is visible |
| 11 | Without navigating away, inspect the left-hand sidebar | The **Docs sidebar** navigation panel is visible, listing API sections. Confirms the full API page content loaded |
| 12 | Navigate back to https://playwright.dev | The homepage loads again with all three navigation links visible |
| 13 | Click the **Community** navigation link | The browser navigates to the Community section. URL contains `/community`. The primary heading **"Welcome"** is visible |
| 14 | Without navigating away, verify a known community resource is present | A **Discord** link is visible on the page, confirming community content loaded correctly |
| 15 | Navigate back to https://playwright.dev | The homepage loads with the navigation bar visible |
| 16 | Verify all three navigation links remain accessible after the full navigation sequence | All three links (Docs, API, Community) are visible, labelled correctly, and are in an enabled/interactive state |

---

## Pass Criteria

- All three links are visible and accessible on the homepage
- Each link routes to the correct URL with the correct `<h1>` heading
- The **Docs sidebar** is present on the Docs (`/docs/intro`) and API (`/docs/api`) destination pages — these are documentation pages that share the same sidebar component
- The **Discord** link is present on the Community page — Community is not a documentation page and has no sidebar; the Discord link serves as the full-content load confirmation for this page type
- All links remain functional after the complete navigation sequence

## Fail Criteria

- Any link is missing, hidden, or disabled on the homepage
- A link routes to the wrong URL or shows the wrong heading
- The Docs sidebar is absent on the Docs or API page
- The Discord link is absent on the Community page

---

# TC-002 — Navigation Link State Persistence on Inner Pages

**Test Case ID:** TC-002  
**Test Case Title:** Verify navigation links remain visible and enabled on all destination pages  
**Application Under Test:** https://playwright.dev  
**Related Automated Test:** `tests/e2e/main.navigation.professional.spec.ts` — `should keep navigation links visible and enabled on destination pages`  
**Related Test Case:** TC-001 (covers homepage navigation baseline)

---

## Manual Test Case:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | **Preconditions:** Open a web browser (Chrome, Firefox, or Edge) and navigate to https://playwright.dev | The Playwright homepage loads successfully. The main navigation bar is visible at the top of the page, containing Docs, API, and Community links |
| 2 | Click the **Docs** navigation link | The browser navigates to the Docs section (URL contains `/docs/intro`) |
| 3 | Without navigating back, inspect the **Docs** navigation link in the top bar | The Docs link is visible in the navigation bar and is not greyed out, hidden, or disabled |
| 4 | Without navigating back, inspect the **API** navigation link in the top bar | The API link is visible in the navigation bar and is not greyed out, hidden, or disabled |
| 5 | Without navigating back, inspect the **Community** navigation link in the top bar | The Community link is visible in the navigation bar and is not greyed out, hidden, or disabled |
| 6 | Navigate back to https://playwright.dev and click the **API** navigation link | The browser navigates to the API section (URL contains `/docs/api`) |
| 7 | Without navigating back, inspect the **Docs** navigation link in the top bar | The Docs link is visible and is not greyed out, hidden, or disabled |
| 8 | Without navigating back, inspect the **API** navigation link in the top bar | The API link is visible and is not greyed out, hidden, or disabled |
| 9 | Without navigating back, inspect the **Community** navigation link in the top bar | The Community link is visible and is not greyed out, hidden, or disabled |
| 10 | Navigate back to https://playwright.dev and click the **Community** navigation link | The browser navigates to the Community section (URL contains `/community`) |
| 11 | Without navigating back, inspect the **Docs** navigation link in the top bar | The Docs link is visible and is not greyed out, hidden, or disabled |
| 12 | Without navigating back, inspect the **API** navigation link in the top bar | The API link is visible and is not greyed out, hidden, or disabled |
| 13 | Without navigating back, inspect the **Community** navigation link in the top bar | The Community link is visible and is not greyed out, hidden, or disabled |

---

## Pass Criteria

- All three navigation links (Docs, API, Community) remain **visible** on every destination page after navigation
- No link becomes hidden, collapsed, or styled as disabled (e.g., greyed out, `pointer-events: none`, `aria-disabled="true"`) when the user is on an inner page
- The navigation bar itself remains fully rendered and accessible on all three destination pages

## Fail Criteria

- Any navigation link disappears or becomes invisible after navigating away from the homepage
- Any navigation link is visually or programmatically disabled on a destination page
- The navigation bar collapses or is absent on any destination page

## Notes

- This test specifically guards against **navbar regression** — a common defect where the top nav collapses or links become non-interactive after client-side routing to an inner page.
- Complements TC-001 which validates navigation from the homepage only.
- Covers quality-review.md **Finding 2.2** (edge cases — navigation state on inner pages).

---

# TC-003 — Network Failure Recovery

**Test Case ID:** TC-003  
**Test Case Title:** Verify navigation fails gracefully during network outage and the site recovers fully when connection is restored  
**Application Under Test:** https://playwright.dev  
**Related Automated Test:** `tests/e2e/main.navigation.professional.spec.ts` — `TC-003 - should handle a simulated network failure gracefully and recover to a working state`  
**Covers:** quality-review.md Finding 2.1 (network failures), Finding 2.3 (error handling)

---

## Manual Test Case:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | **Preconditions:** Open a web browser and navigate to https://playwright.dev. Confirm the page loads fully with all three navigation links visible | The Playwright homepage is loaded and the navigation bar is functional |
| 2 | Simulate a network disconnection: disable Wi-Fi / unplug LAN / use browser DevTools → Network tab → set throttling to **Offline** | Network is no longer available. The browser shows no active connection |
| 3 | Attempt to navigate to the Docs page by clicking the **Docs** navigation link or typing `https://playwright.dev/docs/intro` in the address bar | The browser **does not navigate** to the Docs page. Navigation fails at the network level |
| 4 | Observe what the browser displays after the failed navigation attempt | The browser does not reach the server. Depending on the browser, a built-in error page or blank error state may appear — the exact visual is browser-specific and is not the key assertion |
| 5 | Confirm the URL in the address bar has **not changed** to the Docs URL (`/docs/intro`) | The URL remains unchanged from before the navigation attempt — the browser did not reach the server |
| 6 | Confirm the **Docs page content is absent**: no "Installation" heading, no Docs sidebar | No documentation content is visible. The user is on an error page, not a partially loaded Docs page |
| 7 | Restore the network connection: re-enable Wi-Fi / reconnect LAN / set DevTools throttling back to **No throttling** | Network connection is restored |
| 8 | Navigate to https://playwright.dev | The Playwright homepage loads successfully |
| 9 | Verify all three navigation links (Docs, API, Community) are visible and accessible | All navigation links are displayed, correctly labelled, and are in an enabled/interactive state — the site is fully functional |

---

## Pass Criteria

- Navigation to Docs fails at the network level during the outage — `response` is null (no server response received)
- The URL does not change to the Docs destination during the outage
- No Docs content (heading, sidebar) is visible during the outage
- After restoring the network, the homepage loads fully and all navigation links are accessible

## Fail Criteria

- The browser navigates successfully to Docs during the outage (e.g., due to aggressive caching)
- The URL changes to `/docs/intro` during the outage
- The "Installation" heading is visible during the outage
- After restoring the network, the homepage fails to load or navigation links remain broken

## Notes

- Manual execution: use browser DevTools → Network → Offline to simulate the outage
- In automated test: `context.setOffline(true/false)` provides full network isolation without OS-level changes
- The automated test does **not** assert the visual appearance of the error page — Chromium renders its offline error at `chrome-error://` with an empty `<body>`, so browser-specific visual checks are intentionally omitted; key assertions are `response === null`, URL mismatch, and content absence
- Covers quality-review.md **Finding 2.1** (network failures) and **Finding 2.3** (limited error handling)
