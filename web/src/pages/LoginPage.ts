import { expect, Page } from '@playwright/test';
import { ROUTES, SELECTORS, TEXT } from '../constants';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = this.locator(SELECTORS.login.email);
  private readonly passwordInput = this.locator(SELECTORS.login.password);
  private readonly submitButton = this.locator(SELECTORS.login.submit);

  async open(): Promise<void> {
    await this.goto(ROUTES.login);
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
    await expect(this.page.getByRole('heading', { name: TEXT.loginSuccessHeading })).toBeVisible();
  }

  async expectLoggedInAs(fullName: string): Promise<void> {
    await expect(this.page.getByTestId('nav-menu')).toHaveText(fullName);
  }
}
