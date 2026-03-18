import { expect, test } from '@playwright/test';
import { getAuthTestData } from '../../src/fixtures/testData';
import { AuthPage } from '../../src/pages/AuthPage';
import { HomePage } from '../../src/pages/HomePage';

const authData = getAuthTestData();

/**
 * Builds a lightweight login page used for isolated auth tests.
 */
function loginHtml(): string {
  return `
    <form id="login-form">
      <label for="username">Username</label>
      <input id="username" data-testid="username-input" />
      <label for="password">Password</label>
      <input id="password" data-testid="password-input" type="password" />
      <button type="submit" data-testid="login-btn">Sign in</button>
      <div role="alert" hidden></div>
    </form>
    <script>
      const form = document.getElementById('login-form');
      const userInput = document.getElementById('username');
      const passInput = document.getElementById('password');
      const alertNode = document.querySelector('[role="alert"]');

      form.addEventListener('submit', (event) => {
        event.preventDefault();

        alertNode.hidden = true;
        alertNode.textContent = '';

        if (!userInput.value.trim() || !passInput.value) {
          alertNode.textContent = '${authData.requiredFieldsMessage}';
          alertNode.hidden = false;
          return;
        }

        const isValid = userInput.value === '${authData.validUser.username}' && passInput.value === '${authData.validUser.password}';
        if (isValid) {
          window.location.href = '/home';
          return;
        }

        alertNode.textContent = '${authData.invalidLoginMessage}';
        alertNode.hidden = false;
      });
    </script>
  `;
}

/**
 * Builds a minimal home page with a user avatar marker.
 */
function homeHtml(): string {
  return '<img data-testid="user-avatar" alt="User avatar" src="/avatar.png" />';
}

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: loginHtml(),
      });
    });

    await page.route('**/home', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: homeHtml(),
      });
    });
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/login');
    await page.unroute('**/home');
  });

  test('should show avatar after successful login with valid credentials', async ({ page }) => {
    const authPage = new AuthPage(page);
    const homePage = new HomePage(page);

    // Initialization: open login
    await authPage.open();

    // User actions: fill credentials, submit
    await authPage.login(authData.validUser.username, authData.validUser.password);

    // Verification: successful login -> avatar visible
    await expect(page).toHaveURL(/\/home$/);
    await expect(homePage.avatar()).toBeVisible();
  });

  test('should show error message after invalid login attempt', async ({ page }) => {
    const authPage = new AuthPage(page);

    // Initialization: open login
    await authPage.open();

    // User actions: invalid login
    await authPage.login(authData.invalidUser.username, authData.invalidUser.password);

    // Verification: error message visible
    await expect(page).toHaveURL(/\/login$/);
    await expect(authPage.errorMessage()).toBeVisible();
    await expect(authPage.errorMessage()).toHaveText(authData.invalidLoginMessage);
  });

  test('should stay on login page and show validation message when username and password are empty', async ({ page }) => {
    const authPage = new AuthPage(page);

    // Initialization: open login
    await authPage.open();

    // User actions: submit empty credentials
    await authPage.submit().click();

    // Verification: validation message visible and user remains on login page
    await expect(page).toHaveURL(/\/login$/);
    await expect(authPage.errorMessage()).toBeVisible();
    await expect(authPage.errorMessage()).toHaveText(authData.requiredFieldsMessage);
  });
});
