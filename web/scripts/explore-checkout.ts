import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const email = `cart-${Date.now()}@mobato.test`;
  const password = `MobatoQa!${Date.now()}`;

  await page.request.post('https://api.practicesoftwaretesting.com/users/register', {
    data: {
      email,
      password,
      first_name: 'B',
      last_name: 'A',
      dob: '1990-01-15',
      phone: '11999999999',
      address: { street: 'R', city: 'SP', state: 'SP', country: 'BR', postal_code: '01001000' },
    },
  });

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="email"]').fill(email);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account');

  await page.goto('https://practicesoftwaretesting.com/product/01KVXXSXKGRFJDNE0FSGK0FXJN');
  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(2000);

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForLoadState('networkidle');

  console.log('URL:', page.url());
  console.log('BODY:', (await page.locator('body').innerText()).slice(0, 2000));

  const tests = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test]')].map((e) => ({
      t: e.getAttribute('data-test'),
      text: (e.textContent || '').trim().slice(0, 80),
    }))
  );
  console.log(JSON.stringify(tests, null, 2));

  await browser.close();
}

main();
