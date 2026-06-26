import { test as base } from '@playwright/test';
import { ToolshopApi } from '../api/ToolshopApi';
import { LoginPage, ProductsPage, CartPage, CheckoutPage } from '../pages';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  api: ToolshopApi;
};

export const test = base.extend<Fixtures>({
  context: async ({ context }, use) => {
    await context.clearCookies();
    await use(context);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  api: async ({ request }, use) => {
    await use(new ToolshopApi(request));
  },
});

export { expect } from '@playwright/test';
