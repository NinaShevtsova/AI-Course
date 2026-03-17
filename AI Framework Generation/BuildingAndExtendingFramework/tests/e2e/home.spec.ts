import { test } from '../../src/fixtures/BaseTest';
import { HomePage } from '../../src/pages/HomePage';

/**
 * Smoke test coverage for the home page.
 */
test.describe('Home Page', () => {
  test('should load the home page', async ({ page, baseTest }) => {
    const homePage = new HomePage(page);

    await homePage.open();
    await homePage.expectLoaded();
    await baseTest.expectCurrentUrlContains('/');
  });
});
