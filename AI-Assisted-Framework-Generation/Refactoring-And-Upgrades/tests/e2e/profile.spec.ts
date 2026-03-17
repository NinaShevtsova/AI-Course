import { test } from '../../src/fixtures/BaseTest';
import { getExistingUserCredentials } from '../../src/fixtures/userFixture';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProfilePage } from '../../src/pages/ProfilePage';
import { EnvHelper } from '../../src/utils/envHelper';

/**
 * End-to-end coverage for profile workflows.
 */
test.describe.serial('Profile Page', () => {
  const targetUsername = EnvHelper.getOptionalEnv('E2E_PROFILE_USERNAME', 'QA Automation User');
  const targetEmail = EnvHelper.getOptionalEnv('E2E_PROFILE_EMAIL', 'qa.automation@example.com');

  test.beforeEach(async ({ page, request }) => {
    const user = getExistingUserCredentials();

    await request.post('/api/reset');
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/\/$/);
  });

  test('should upload a new avatar', async ({ page, baseTest }) => {
    const profilePage = new ProfilePage(page);
    const avatarPath = 'tests/e2e/assets/avatar.svg';

    await profilePage.open();
    await profilePage.updateAvatar(avatarPath);
    await profilePage.verifyUpdateSuccess();
    await baseTest.expectCurrentUrlContains('/profile');
  });

  test('should update username', async ({ page, baseTest }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.open();
    await profilePage.updateUsername(targetUsername);
    await profilePage.verifyUpdateSuccess();
    await profilePage.verifyProfileField('Username', targetUsername);
    await baseTest.expectCurrentUrlContains('/profile');
  });

  test('should update email', async ({ page, baseTest }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.open();
    await profilePage.updateEmail(targetEmail);
    await profilePage.verifyUpdateSuccess();
    await profilePage.verifyProfileField('Email', targetEmail);
    await baseTest.expectCurrentUrlContains('/profile');
  });

  test('should update password and login with the new password', async ({ page }) => {
    const user = getExistingUserCredentials();
    const profilePage = new ProfilePage(page);
    const loginPage = new LoginPage(page);
    const requestedNewPassword = EnvHelper.getOptionalEnv('E2E_NEW_USER_PASSWORD', 'NewPass123');
    const newPassword = requestedNewPassword === user.password ? `${requestedNewPassword}_new` : requestedNewPassword;

    await profilePage.open();
    await profilePage.updatePassword(user.password, newPassword);
    await profilePage.verifyUpdateSuccess();

    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await loginPage.login(user.email, newPassword);
    await loginPage.verifyLoginSuccess();
  });

  test('should remove avatar and show default avatar', async ({ page, baseTest }) => {
    const profilePage = new ProfilePage(page);

    await profilePage.open();
    await profilePage.removeAvatar();
    await profilePage.verifyUpdateSuccess();
    await profilePage.verifyDefaultAvatar();
    await baseTest.expectCurrentUrlContains('/profile');
  });
});
