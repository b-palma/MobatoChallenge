import { expect, Page } from '@playwright/test';
import { SELECTORS, TEST_DATA, TEXT } from '../constants';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly proceed2 = this.locator(SELECTORS.checkout.proceed2);
  private readonly proceed3 = this.locator(SELECTORS.checkout.proceed3);
  private readonly paymentMethod = this.locator(SELECTORS.checkout.paymentMethod);
  private readonly finishButton = this.locator(SELECTORS.checkout.finish);

  async completeBillingStep(): Promise<void> {
    await expect(this.proceed2).toBeVisible();
    await this.proceed2.click();

    await this.fillBillingAddress();
    await expect(this.proceed3).toBeVisible();
    await this.proceed3.click();
  }

  async completePaymentStep(): Promise<void> {
    const { checkout } = TEST_DATA;

    await expect(this.paymentMethod).toBeVisible();
    await this.paymentMethod.selectOption({ label: checkout.paymentMethod });

    await this.page.getByLabel(TEXT.bankName).fill(checkout.bankName);
    await this.page.getByLabel(TEXT.accountName).fill(checkout.accountName);
    await this.page.getByLabel(TEXT.accountNumber).fill(checkout.accountNumber);

    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.page.getByText(TEXT.orderConfirmed)).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible();
  }

  private async fillBillingAddress(): Promise<void> {
    const { address } = TEST_DATA.userDefaults;

    await this.fillIfEmpty(SELECTORS.checkout.postalCode, address.postalCode);
    await this.fillIfEmpty(SELECTORS.checkout.houseNumber, address.houseNumber);
    await this.fillIfEmpty(SELECTORS.checkout.street, address.street);
    await this.fillIfEmpty(SELECTORS.checkout.city, address.city);
    await this.fillIfEmpty(SELECTORS.checkout.state, address.state);

    const country = this.locator(SELECTORS.checkout.country);
    if (await country.isVisible()) {
      await country.selectOption({ value: address.country });
    }
  }

  private async fillIfEmpty(testId: string, value: string): Promise<void> {
    const field = this.locator(testId);
    if (!(await field.isVisible())) return;

    const current = await field.inputValue();
    if (!current) {
      await field.fill(value);
    }
  }
}
