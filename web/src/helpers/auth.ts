import { Page } from '@playwright/test';

export async function injectAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((authToken) => {
    localStorage.setItem('auth-token', authToken);
  }, token);
}
