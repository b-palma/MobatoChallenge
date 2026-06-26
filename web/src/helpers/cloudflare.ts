import { Page } from '@playwright/test';

export async function isCloudflareChallenge(page: Page): Promise<boolean> {
  const securityCheck = page.getByText('Performing security verification');
  const verifyHuman = page.getByText('Verify you are human');
  const turnstile = page.locator('iframe[src*="challenges.cloudflare.com"]');

  if (await securityCheck.isVisible().catch(() => false)) return true;
  if (await verifyHuman.isVisible().catch(() => false)) return true;
  return (await turnstile.count()) > 0;
}
