import { chromium } from '@playwright/test';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com');

  const homeSelectors = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-test], [data-testid], input, button, a');
    return Array.from(elements).slice(0, 40).map((el) => ({
      tag: el.tagName,
      test: el.getAttribute('data-test'),
      testid: el.getAttribute('data-testid'),
      text: (el.textContent || '').trim().slice(0, 50),
      placeholder: el.getAttribute('placeholder'),
      name: el.getAttribute('name'),
      type: el.getAttribute('type'),
    }));
  });
  console.log('HOME:', JSON.stringify(homeSelectors, null, 2));

  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.waitForLoadState('networkidle');

  const loginSelectors = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-test], [data-testid], input, button');
    return Array.from(elements).map((el) => ({
      tag: el.tagName,
      test: el.getAttribute('data-test'),
      testid: el.getAttribute('data-testid'),
      placeholder: el.getAttribute('placeholder'),
      name: el.getAttribute('name'),
      type: el.getAttribute('type'),
    }));
  });
  console.log('LOGIN:', JSON.stringify(loginSelectors, null, 2));
  console.log('LOGIN URL:', page.url());

  await browser.close();
}

explore().catch(console.error);
