import { expect, Page } from '@playwright/test';
import { ROUTES, SELECTORS, TEXT } from '../constants';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly proceedButton = this.page.getByRole('button', { name: /Proceed to checkout/i });

  async open(): Promise<void> {
    await this.goto(ROUTES.checkout);
  }

  async expectProductInCart(productName: string): Promise<void> {
    await expect(this.locator(SELECTORS.cart.productTitle).filter({ hasText: new RegExp(productName, 'i') })).toBeVisible();
  }

  async expectNotEmpty(): Promise<void> {
    await expect(this.page.getByText(TEXT.emptyCart)).toHaveCount(0);
    await expect(this.locator(SELECTORS.cart.linePrice)).toBeVisible();
  }

  async expectCartTotalVisible(): Promise<void> {
    await expect(this.locator(SELECTORS.cart.total)).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedButton).toBeVisible();
    await this.proceedButton.click();
  }
}
