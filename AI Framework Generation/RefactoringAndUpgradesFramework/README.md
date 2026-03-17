# Refactoring And Upgrades Framework

TypeScript + Playwright training project built around Page Object Model conventions, reusable base abstractions, and a self-contained mock web application.

## Purpose

This project is the working reference implementation inside `AI Framework Generation`.

It includes:

- page objects for login, profile, home, and refactoring examples
- reusable `BasePage` and `BaseTest` abstractions
- a local mock server so tests can run without an external application
- examples of both pre-refactor and post-refactor page object design

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
|   |   |-- ProfilePage.ts
|   |   |-- RefactoringNeedsPage.ts
|   |   `-- RefactoringNeedsPageRefactored.ts
|   `-- utils
|       |-- envHelper.ts
|       `-- logger.ts
|-- tests
|   |-- e2e
|   |   |-- home.spec.ts
|   |   |-- login.spec.ts
|   |   |-- profile.spec.ts
|   |   |-- refactored.spec.ts
|   |   `-- assets
|   |       `-- avatar.svg
|   `-- mock-server.cjs
|-- playwright.config.ts
|-- package.json
`-- tsconfig.json
```

## Selector Rules

Use only these selector strategies in page objects and tests:

- `getByRole`
- `getByLabel`
- `getByTestId`

Avoid CSS selectors, XPath, and text selectors unless there is an explicit exception.

## Test Architecture

- `BasePage` contains shared Playwright actions and selector helpers.
- `BaseTest` wraps common setup, teardown, and URL assertions.
- `userFixture.ts` provides reusable test credentials with default local values.
- `tests/mock-server.cjs` serves the demo application used by the tests.

The Playwright config starts the mock server automatically through the `webServer` setting, so local execution does not require a real frontend running on a separate port.

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

Run tests in headed mode:

```bash
npm run test:headed
```

Open the Playwright HTML report:

```bash
npm run report
```

## Current Test Status

At the moment this project is configured and verified as runnable locally with the built-in mock server.

Verified suite:

- `home.spec.ts`
- `login.spec.ts`
- `profile.spec.ts`
- `refactored.spec.ts`

## Refactoring Example

The project intentionally keeps two versions of the same dropdown workflow:

- `RefactoringNeedsPage.ts` is the before version with three separate methods
- `RefactoringNeedsPageRefactored.ts` is the after version with one parameterized method

This is useful for code review, refactoring practice, and test coverage analysis.

## Environment Variables

The framework can run without custom environment variables because safe defaults are provided for local execution.

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

If `BASE_URL` is not provided, the project uses the local mock server on `http://localhost:3000`.
