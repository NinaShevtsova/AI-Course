import { expect, test } from '@playwright/test';
import { getSearchTestData } from '../../src/fixtures/testData';
import { ResultsPage } from '../../src/pages/ResultsPage';
import { SearchPage } from '../../src/pages/SearchPage';

const searchData = getSearchTestData();

function searchHtml(): string {
  const serializedResults = JSON.stringify(searchData.results);

  return `
    <h1>Search</h1>
    <label for="search-input">Search</label>
    <input id="search-input" aria-label="Search" />
    <button type="button">Search</button>
    <div role="group" aria-label="Filters">
      <button type="button">${searchData.filterName}</button>
    </div>
    <div role="list" data-testid="results" aria-label="Results"></div>
    <script>
      const queryInput = document.getElementById('search-input');
      const searchButton = document.querySelector('button');
      const filterButton = document.querySelector('[aria-label="Filters"] button');
      const resultsNode = document.querySelector('[data-testid="results"]');
      const allResults = ${serializedResults};
      let filteredResults = [];

      function renderResults(items) {
        resultsNode.innerHTML = items.map((item) => \
          \`<div role="listitem" data-testid="result-item">\
            <span data-testid="result-title">\${item.title}</span>\
            <span data-testid="result-price">$\${item.price}</span>\
          </div>\`
        ).join('');
      }

      function performSearch() {
        const query = queryInput.value.trim().toLowerCase();
        filteredResults = allResults.filter((item) => item.title.toLowerCase().includes(query));
        renderResults(filteredResults);
      }

      searchButton.addEventListener('click', performSearch);
      filterButton.addEventListener('click', () => {
        const maxPrice = ${searchData.maxPrice};
        filteredResults = filteredResults.filter((item) => item.price < maxPrice);
        renderResults(filteredResults);
      });
    </script>
  `;
}

test.describe('Search flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/search', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: searchHtml(),
      });
    });
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/search');
  });

  test('should show only results priced below 1000 after applying the price filter', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const resultsPage = new ResultsPage(page);
    const filteredResults = searchData.results.filter((item) => item.price < searchData.maxPrice);
    const hiddenResults = searchData.results.filter((item) => item.price >= searchData.maxPrice);

    await searchPage.open();
    await searchPage.search(searchData.query);
    await searchPage.applyFilter(searchData.filterName);

    await expect(page).toHaveURL(/\/search$/);
    await expect(resultsPage.items().first()).toBeVisible();
    await expect(resultsPage.items()).toHaveCount(filteredResults.length);

    const prices = await resultsPage.getAllPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices).toHaveLength(filteredResults.length);

    for (let index = 0; index < filteredResults.length; index += 1) {
      await expect(resultsPage.items().nth(index)).toBeVisible();
      expect(await resultsPage.titleOf(index)).toBe(filteredResults[index].title);
      expect(await resultsPage.priceOf(index)).toBe(filteredResults[index].price);
      expect(prices[index]).toBeLessThan(searchData.maxPrice);
    }

    for (const hiddenResult of hiddenResults) {
      await expect(page.getByTestId('results')).not.toContainText(hiddenResult.title);
    }
  });
});