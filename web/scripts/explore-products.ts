import { chromium } from '@playwright/test';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com');
  await page.waitForLoadState('networkidle');

  const productSelectors = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-test]');
    return Array.from(elements).map((el) => ({
      test: el.getAttribute('data-test'),
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 40),
    }));
  });
  console.log('PRODUCTS HOME:', JSON.stringify(productSelectors, null, 2));

  const searchInput = page.getByPlaceholder('Search');
  if (await searchInput.count()) {
    await searchInput.fill('Hammer');
    await page.waitForLoadState('networkidle');
    const afterSearch = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
        test: el.getAttribute('data-test'),
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
      }));
    });
    console.log('AFTER SEARCH:', JSON.stringify(afterSearch, null, 2));
  }

  const firstProduct = page.locator('[data-test="product-name"]').first();
  if (await firstProduct.count()) {
    const name = await firstProduct.textContent();
    console.log('FIRST PRODUCT:', name);
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    const detail = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
        test: el.getAttribute('data-test'),
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 40),
      }));
    });
    console.log('PRODUCT DETAIL:', JSON.stringify(detail, null, 2));
  }

  await browser.close();
}

explore().catch(console.error);
