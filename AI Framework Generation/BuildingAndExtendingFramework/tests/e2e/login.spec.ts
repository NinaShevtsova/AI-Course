import { test } from '../../src/fixtures/BaseTest';
import { getExistingUserCredentials } from '../../src/fixtures/userFixture';
import { LoginPage } from '../../src/pages/LoginPage';
import { EnvHelper } from '../../src/utils/envHelper';

/**
 * End-to-end coverage for login workflows.
 */
test.describe('Login Page', () => {
  const invalidCredentialsMessage = EnvHelper.getOptionalEnv(
    'E2E_INVALID_CREDENTIALS_MESSAGE',
    'Invalid credentials',
  );
  const requiredFieldMessage = EnvHelper.getOptionalEnv('E2E_REQUIRED_FIELD_MESSAGE', 'Required');

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
  });

  test('should log in with valid credentials', async ({ page, baseTest }) => {
    const user = getExistingUserCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.login(user.email, user.password);
    await loginPage.verifyLoginSuccess();
    await baseTest.expectCurrentUrlContains('/');
  });

  test('should log in with valid credentials using explicit form steps', async ({ page, baseTest }) => {
    const user = getExistingUserCredentials();
    const loginPage = new LoginPage(page);

    await loginPage.fillUsername(user.email);
    await loginPage.fillPassword(user.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginSuccess();
    await baseTest.expectCurrentUrlContains('/');
  });

  test('should show an error message for invalid password', async ({ page, baseTest }) => {
    const user = getExistingUserCredentials();
    const loginPage = new LoginPage(page);
    const invalidPassword = `${user.password}__invalid`;

    await loginPage.fillUsername(user.email);
    await loginPage.fillPassword(invalidPassword);
    await loginPage.clickLogin();
    await loginPage.verifyErrorMessage(invalidCredentialsMessage);
    await baseTest.expectCurrentUrlContains('/login');
  });

  test('should show field validation when submitting empty form', async ({ page, baseTest }) => {
    const loginPage = new LoginPage(page);

    await loginPage.clickLogin();
    await loginPage.verifyFieldValidation('Email', requiredFieldMessage);
    await loginPage.verifyFieldValidation('Password', requiredFieldMessage);
    await baseTest.expectCurrentUrlContains('/login');
  });
});
