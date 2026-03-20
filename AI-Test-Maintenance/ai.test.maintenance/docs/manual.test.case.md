# Manual Test Case: Navigation Buttons Display and Functionality

**Test Case ID:** TC001  
**Test Case Title:** Verify main page displays and functions navigation buttons: Docs, API, Community  
**Application Under Test:** https://playwright.dev  

## Manual Test Case:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1    | **Preconditions:** Open a web browser (Chrome, Firefox, or Edge) and navigate to https://playwright.dev | The Playwright homepage loads successfully and displays the main content |
| 2    | Locate the navigation area at the top of the page | The main navigation menu is visible and contains multiple navigation items |
| 3    | Verify the "Docs" navigation button is present | The "Docs" navigation item is clearly visible with readable text |
| 4    | Verify the "API" navigation button is present | The "API" navigation item is clearly visible with readable text |
| 5    | Verify the "Community" navigation button is present | The "Community" navigation item is clearly visible with readable text |
| 6    | Inspect the "Docs" button for accessibility properties | The "Docs" item appears as a clickable link with proper visual styling (underline, hover effect, or button appearance) |
| 7    | Inspect the "API" button for accessibility properties | The "API" item appears as a clickable link with proper visual styling (underline, hover effect, or button appearance) |
| 8    | Inspect the "Community" button for accessibility properties | The "Community" item appears as a clickable link with proper visual styling (underline, hover effect, or button appearance) |
| 9    | Click on the "Docs" navigation button | The page navigates to the documentation section, and the page heading shows "Introduction" or similar docs-related title |
| 10   | Verify the current page URL | The URL contains "/docs" indicating successful navigation to documentation |
| 11   | Navigate back to the main page (https://playwright.dev) | The homepage loads again with all navigation buttons visible |
| 12   | Click on the "API" navigation button | The page navigates to the API documentation section, and the page heading shows "API reference" or similar API-related title |
| 13   | Verify the current page URL | The URL contains "/docs/api" or similar API path indicating successful navigation |
| 14   | Navigate back to the main page (https://playwright.dev) | The homepage loads again with all navigation buttons visible |
| 15   | Click on the "Community" navigation button | The page navigates to the community section, and the page heading shows "Community" or displays community-related content |
| 16   | Verify the current page URL | The URL contains "/community" or similar community path indicating successful navigation |
| 17   | Navigate back to the main page (https://playwright.dev) | The homepage loads again with all three navigation buttons (Docs, API, Community) remain visible and functional |

**Pass Criteria:**
- All three navigation buttons (Docs, API, Community) are visible on the main page
- Each button has proper visual styling indicating it's clickable
- Clicking each button successfully navigates to the correct section
- Page URLs and headings confirm successful navigation
- All buttons remain functional after navigation testing
