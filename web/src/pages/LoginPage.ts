import { expect, Page, TestInfo } from '@playwright/test';
import { ToolshopApi } from '../api/ToolshopApi';
import { API, ROUTES, SELECTORS, TEXT, ENV } from '../constants';
import { UserCredentials } from '../factories/userFactory';
import { injectAuthToken } from '../helpers/auth';
import { isCloudflareChallenge } from '../helpers/cloudflare';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailInput = this.locator(SELECTORS.login.email);
  private readonly passwordInput = this.locator(SELECTORS.login.password);
  private readonly submitButton = this.locator(SELECTORS.login.submit);

  async open(): Promise<void> {
    await this.page.goto(new URL(ROUTES.login, ENV.baseUrl).toString(), { waitUntil: 'load' });
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.locator(SELECTORS.login.form)).toBeVisible({ timeout: 15_000 });
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    const loginResponse = this.page.waitForResponse(
      (response) => response.url().includes(`${API.login}`) && response.ok(),
      { timeout: 20_000 },
    );
    const profileResponse = this.page.waitForResponse(
      (response) => response.url().includes('/users/me') && response.ok(),
      { timeout: 20_000 },
    );

    await Promise.all([
      loginResponse,
      profileResponse,
      this.page.waitForURL(/\/account/, { timeout: 20_000 }),
      this.submitButton.click(),
    ]);
  }

  async loginFromHome(email: string, password: string): Promise<void> {
    await this.page.getByRole('link', { name: TEXT.signIn }).click();
    await this.login(email, password);
  }

  async ensureAuthenticated(
    credentials: UserCredentials,
    api: ToolshopApi,
    testInfo?: TestInfo,
  ): Promise<void> {
    await this.page.goto(new URL(ROUTES.login, ENV.baseUrl).toString(), { waitUntil: 'load' });

    if (await isCloudflareChallenge(this.page)) {
      testInfo?.annotations.push({
        type: 'cloudflare-fallback',
        description: 'Cloudflare bloqueou login UI; sessao criada via API',
      });

      const token = await api.login(credentials.email, credentials.password);
      await injectAuthToken(this.page, token);

      const profileResponse = this.page.waitForResponse(
        (response) => response.url().includes('/users/me') && response.ok(),
        { timeout: 20_000 },
      );
      await this.page.goto(new URL(ROUTES.account, ENV.baseUrl).toString(), { waitUntil: 'load' });
      await profileResponse;
      return;
    }

    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.locator(SELECTORS.login.form)).toBeVisible({ timeout: 15_000 });
    await this.login(credentials.email, credentials.password);
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/);
    await expect(this.locator(SELECTORS.nav.menu)).toBeVisible({ timeout: 10_000 });
    await expect(this.locator(SELECTORS.account.pageTitle)).toHaveText(TEXT.loginSuccessHeading);
  }

  async expectLoggedInAs(fullName: string): Promise<void> {
    await expect(this.locator(SELECTORS.nav.menu)).toBeVisible({ timeout: 15_000 });
    await expect(this.locator(SELECTORS.nav.menu)).toHaveText(fullName);
  }
}
