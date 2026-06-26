import { chromium } from '@playwright/test';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const email = `explore-${Date.now()}@mobato.test`;
  const password = `MobatoQa!${Date.now()}`;

  const regRes = await page.request.post('https://api.practicesoftwaretesting.com/users/register', {
    data: {
      email,
      password,
      first_name: 'Bruno',
      last_name: 'Amaral',
      dob: '1990-01-15',
      phone: '11999999999',
      address: {
        street: 'Rua Teste',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'BR',
        postal_code: '01001000',
      },
    },
  });
  console.log('REGISTER:', regRes.status());

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.getByTestId('email').fill(email);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('**/account');

  console.log('AFTER LOGIN URL:', page.url());

  const navAfterLogin = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
      test: el.getAttribute('data-test'),
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 40),
    }))
  );
  console.log('NAV AFTER LOGIN:', JSON.stringify(navAfterLogin.filter((x) => x.test?.startsWith('nav')), null, 2));

  await page.goto('https://practicesoftwaretesting.com');
  await page.waitForLoadState('networkidle');

  const productLink = page.locator('[data-test^="product-01"]').first();
  await productLink.click();
  await page.waitForLoadState('networkidle');
  console.log('PRODUCT URL:', page.url());

  const detail = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
      test: el.getAttribute('data-test'),
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 40),
    }))
  );
  console.log('PRODUCT DETAIL:', JSON.stringify(detail, null, 2));

  const addBtn = page.locator('[data-test="add-to-cart"], [data-test="add-to-basket"], button:has-text("Add")');
  if (await addBtn.count()) {
    await addBtn.first().click();
    await page.waitForTimeout(2000);
  }

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForLoadState('networkidle');
  const cart = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
      test: el.getAttribute('data-test'),
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 40),
    }))
  );
  console.log('CART/CHECKOUT:', JSON.stringify(cart, null, 2));

  await browser.close();
}

explore().catch(console.error);
