import { type Locator, type Page } from '@playwright/test';

export class AuthPage {
  constructor(private readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto('/login');
  }

  public username(): Locator {
    return this.page.getByLabel('Username');
  }

  public password(): Locator {
    return this.page.getByLabel('Password');
  }

  public submit(): Locator {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  public errorMessage(): Locator {
    return this.page.getByRole('alert');
  }

  public async login(user: string, pass: string): Promise<void> {
    await this.username().fill(user);
    await this.password().fill(pass);
    await this.submit().click();
  }
}
