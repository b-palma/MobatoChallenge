import { expect, Page } from '@playwright/test';
import { ROUTES, SELECTORS, TEXT, ENV } from '../constants';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = this.locator(SELECTORS.login.email);
  private readonly passwordInput = this.locator(SELECTORS.login.password);
  private readonly submitButton = this.locator(SELECTORS.login.submit);

  async open(): Promise<void> {
    await this.page.goto(new URL(ROUTES.login, ENV.baseUrl).toString(), { waitUntil: 'networkidle' });
    await expect(this.locator(SELECTORS.login.form)).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginFromHome(email: string, password: string): Promise<void> {
    await this.page.getByRole('link', { name: TEXT.signIn }).click();
    await this.login(email, password);
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/);
    await expect(this.locator(SELECTORS.account.pageTitle)).toBeVisible({ timeout: 15_000 });
    await expect(this.locator(SELECTORS.account.pageTitle)).toHaveText(TEXT.loginSuccessHeading);
  }

  async expectLoggedInAs(fullName: string): Promise<void> {
    await expect(this.locator(SELECTORS.nav.menu)).toBeVisible({ timeout: 15_000 });
    await expect(this.locator(SELECTORS.nav.menu)).toHaveText(fullName);
  }
}
