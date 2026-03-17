import { expect, test as base, type Page, type TestInfo } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Base test wrapper with reusable setup and teardown hooks.
 */
export class BaseTest {
  private readonly page: Page;
  private readonly testInfo: TestInfo;
  private readonly logger: Logger;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.logger = new Logger('BaseTest');
  }

  /**
   * Runs pre-test setup steps.
   */
  public async setup(): Promise<void> {
    this.logger.info(`Starting test: ${this.testInfo.title}`);
  }

  /**
   * Runs post-test cleanup steps.
   */
  public async teardown(): Promise<void> {
    this.logger.info(`Finished test: ${this.testInfo.title}`);
  }

  /**
   * Opens a URL and waits for DOM content loaded.
   */
  public async open(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Validates that the current URL contains the provided path.
   */
  public async expectCurrentUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
}

type BaseFixtures = {
  baseTest: BaseTest;
};

export const test = base.extend<BaseFixtures>({
  baseTest: async ({ page }, use, testInfo) => {
    const baseTest = new BaseTest(page, testInfo);
    await baseTest.setup();
    await use(baseTest);
    await baseTest.teardown();
  },
});

export { expect };
