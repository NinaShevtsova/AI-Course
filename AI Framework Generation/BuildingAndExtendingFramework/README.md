# Building And Extending Framework

TypeScript + Playwright training project for framework growth, reusable test architecture, and Page Object Model exercises.

## Purpose

This project mirrors the general structure of `RefactoringAndUpgradesFramework`, but is intended as the branch for extending the framework with new modules and helper patterns.

## Current Structure

```text
.
|-- src
|   |-- components
|   |   |-- BaseComponent.ts
|   |   `-- HeaderComponent.ts
|   |-- fixtures
|   |   |-- BaseTest.ts
|   |   `-- userFixture.ts
|   |-- pages
|   |   |-- BasePage.ts
|   |   |-- HomePage.ts
|   |   |-- LoginPage.ts
|   |   `-- ProfilePage.ts
|   `-- utils
|       |-- envHelper.ts
|       `-- logger.ts
|-- tests
|   |-- e2e
|   |   |-- home.spec.ts
|   |   |-- login.spec.ts
|   |   |-- profile.spec.ts
|   |   `-- assets
|   |       `-- avatar.svg
|   `-- mock-server.cjs
|-- playwright.config.ts
|-- package.json
`-- tsconfig.json
```

## Selector Rules

Use only these selector strategies:

- `getByRole`
- `getByLabel`
- `getByTestId`

This rule applies to page objects and test files.

## Test Architecture

- `BasePage` centralizes navigation, wait helpers, and allowed selectors.
- `BaseTest` wraps shared setup and assertions.
- `userFixture.ts` provides reusable credentials.
- `tests/mock-server.cjs` runs a local demo app for Playwright.

## Install

```bash
npm install
npx playwright install
```

## Run Tests

Run all tests:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Open the Playwright report:

```bash
npm run report
```

## Environment Variables

Optional variables:

- `BASE_URL`
- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`
- `E2E_NEW_USER_PASSWORD`
- `E2E_PROFILE_USERNAME`
- `E2E_PROFILE_EMAIL`
- `E2E_INVALID_CREDENTIALS_MESSAGE`
- `E2E_REQUIRED_FIELD_MESSAGE`
- `E2E_PROFILE_SUCCESS_MESSAGE`

When `BASE_URL` is not provided, Playwright uses the local mock server configured in `playwright.config.ts`.

## Notes

- This project currently shares the same Playwright scripts as the refactoring project.
- Use this folder for new modules, helper expansion, and framework extension exercises.
- If behavior diverges between the two projects, update the relevant README so the difference stays documented.
