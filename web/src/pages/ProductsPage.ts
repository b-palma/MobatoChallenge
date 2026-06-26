import { expect, Page } from '@playwright/test';
import { ROUTES, SELECTORS } from '../constants';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  private readonly searchInput = this.locator(SELECTORS.products.searchQuery);
  private readonly searchButton = this.locator(SELECTORS.products.searchSubmit);
  private readonly navCart = this.locator('nav-cart');

  async open(): Promise<void> {
    await this.goto(ROUTES.home);
    await expect(this.searchInput).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async expectProductVisible(name: string): Promise<void> {
    await expect(this.locator(SELECTORS.products.name).filter({ hasText: name }).first()).toBeVisible();
  }

  async expectProductsVisible(names: readonly string[]): Promise<void> {
    for (const name of names) {
      await this.expectProductVisible(name);
    }
  }

  async expectMinimumResults(minimum: number): Promise<void> {
    await expect
      .poll(async () => this.locator(SELECTORS.products.name).count())
      .toBeGreaterThanOrEqual(minimum);
  }

  async expectResultsContainTerm(term: string): Promise<void> {
    const pattern = new RegExp(term, 'i');
    const names = await this.locator(SELECTORS.products.name).allTextContents();
    expect(names.some((name) => pattern.test(name))).toBeTruthy();
  }

  async openProductByName(name: string): Promise<void> {
    await this.locator(SELECTORS.products.name).filter({ hasText: name }).first().click();
  }

  async openProductById(productId: string): Promise<void> {
    await this.goto(ROUTES.product(productId));
    await expect(this.locator(SELECTORS.products.name)).toBeVisible();
  }

  async addProductToCart(): Promise<void> {
    await this.locator(SELECTORS.products.addToCart).click();
  }

  async expectAddToCartVisible(): Promise<void> {
    await expect(this.locator(SELECTORS.products.addToCart)).toBeVisible();
  }

  async expectCartHasItems(): Promise<void> {
    await expect(this.navCart).toBeVisible();
    await expect(this.navCart).not.toHaveText(/^0?$/);
  }
}
