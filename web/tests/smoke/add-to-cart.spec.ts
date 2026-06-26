import { test } from '../../src/fixtures/test.fixture';
import { TAGS, TEST_DATA } from '../../src/constants';

test.describe('Checkout', () => {
  test(`${TAGS.smoke} should complete purchase from product search to order confirmation`, async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    api,
  }, testInfo) => {
    const user = await api.createUser();

    await loginPage.ensureAuthenticated(user, api, testInfo);
    await loginPage.expectSuccessfulLogin();
    await loginPage.expectLoggedInAs(`${TEST_DATA.userDefaults.firstName} ${TEST_DATA.userDefaults.lastName}`);

    await productsPage.open();
    await productsPage.search(TEST_DATA.productName);
    await productsPage.openProductByName(TEST_DATA.productName);
    await productsPage.expectAddToCartVisible();
    await productsPage.addProductToCart();
    await productsPage.expectCartHasItems();

    await cartPage.open();
    await cartPage.expectProductInCart(TEST_DATA.productName);
    await cartPage.expectNotEmpty();
    await cartPage.expectCartTotalVisible();
    await cartPage.proceedToCheckout();

    await checkoutPage.completeBillingStep();
    await checkoutPage.completePaymentStep();
    await checkoutPage.expectOrderConfirmed();
  });
});
