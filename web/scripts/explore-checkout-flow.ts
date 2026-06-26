import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const email = `checkout-${Date.now()}@mobato.test`;
  const password = `MobatoQa!${Date.now()}`;

  await page.request.post('https://api.practicesoftwaretesting.com/users/register', {
    data: {
      email,
      password,
      first_name: 'Bruno',
      last_name: 'Amaral',
      dob: '1990-01-15',
      phone: '11999999999',
      address: {
        street: 'Rua Teste 123',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'BR',
        postal_code: '01001000',
      },
    },
  });

  await page.goto('https://practicesoftwaretesting.com/auth/login', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test=email]').fill(email);
  await page.locator('[data-test=password]').fill(password);
  await page.locator('[data-test=login-submit]').click();
  await page.waitForURL('**/account');

  await page.goto('https://practicesoftwaretesting.com', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test=search-query]').fill('Claw Hammer');
  await page.locator('[data-test=search-submit]').click();
  await page.locator('[data-test=product-name]').first().click();
  await page.locator('[data-test=add-to-cart]').click();
  await page.goto('https://practicesoftwaretesting.com/checkout', { waitUntil: 'domcontentloaded' });

  const dump = async (step: string) => {
    console.log(`\n=== ${step} ===`);
    console.log('URL:', page.url());
    const tests = await page.evaluate(() =>
      [...document.querySelectorAll('[data-test]')].map((el) => ({
        test: el.getAttribute('data-test'),
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 60),
      }))
    );
    console.log(JSON.stringify(tests, null, 2));
  };

  await dump('CART');

  const proceed = page.getByRole('button', { name: /Proceed to checkout/i });
  if (await proceed.count()) {
    await proceed.click();
    await page.waitForLoadState('domcontentloaded');
    await dump('AFTER PROCEED');
  }

  const proceed2 = page.locator('[data-test=proceed-2]');
  if (await proceed2.isVisible()) {
    await proceed2.click();
    await page.waitForLoadState('domcontentloaded');
    await dump('BILLING');
  }

  const proceed3 = page.locator('[data-test=proceed-3]');
  if (await proceed3.isVisible()) {
    await proceed3.click();
    await page.waitForLoadState('domcontentloaded');
    await dump('PAYMENT');
  }

  const finish = page.locator('[data-test=finish]');
  if (await finish.isVisible()) {
    await finish.click();
    await page.waitForLoadState('domcontentloaded');
    await dump('CONFIRMATION');
    console.log('BODY:', (await page.locator('body').innerText()).slice(0, 800));
  }

  await browser.close();
}

main();
