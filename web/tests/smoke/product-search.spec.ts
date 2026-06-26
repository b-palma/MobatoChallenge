import { test } from '../../src/fixtures/test.fixture';
import { TAGS, TEST_DATA } from '../../src/constants';

test.describe('Product Search', () => {
  for (const scenario of TEST_DATA.searchScenarios) {
    test(`${TAGS.smoke} should find products for "${scenario.term}"`, async ({ productsPage }) => {
      await productsPage.openFresh();
      await productsPage.search(scenario.term);

      await productsPage.expectMinimumResults(scenario.minimumResults);
      await productsPage.expectProductsVisible(scenario.expectedProducts);
      await productsPage.expectResultsContainTerm(scenario.term);
    });
  }
});
