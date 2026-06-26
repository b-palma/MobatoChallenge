import { Page, Locator } from '@playwright/test';
import { ENV, ROUTES } from '../constants';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected locator(testId: string): Locator {
    return this.page.locator(`[data-test="${testId}"]`);
  }

  async goto(path: string = ROUTES.home): Promise<void> {
    await this.page.goto(new URL(path, ENV.baseUrl).toString(), { waitUntil: 'domcontentloaded' });
  }

  async openFresh(path: string = ROUTES.home): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.goto(new URL(path, ENV.baseUrl).toString(), { waitUntil: 'domcontentloaded' });
  }
}
