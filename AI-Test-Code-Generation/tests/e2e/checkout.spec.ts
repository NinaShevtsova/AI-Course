import { expect, test } from '@playwright/test';
import { Header } from '../../src/components/Header';
import { getCheckoutTestData } from '../../src/fixtures/testData';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { ProductPage } from '../../src/pages/ProductPage';
import { SearchPage } from '../../src/pages/SearchPage';

const checkoutData = getCheckoutTestData();

/**
 * Mocks a search page that exposes query, submit, and product result link.
 */
function searchHtml(): string {
  return `
    <header>
      <span data-testid="cart-badge">0</span>
    </header>
    <label for="search-input">Search</label>
    <input id="search-input" />
    <button type="button" id="search-btn">Search</button>
    <a href="/product/1" id="product-link">${checkoutData.productName}</a>
    <script>
      const button = document.getElementById('search-btn');
      const link = document.getElementById('product-link');
      button.addEventListener('click', () => {
        const value = document.getElementById('search-input').value.trim();
        link.hidden = value.length === 0;
      });
    </script>
  `;
}

/**
 * Mocks a product page with title, price, and add-to-cart behavior.
 */
function productHtml(): string {
  return `
    <header>
      <a href="/cart" aria-label="Cart">Cart</a>
      <span data-testid="cart-badge">0</span>
    </header>
    <h1 data-testid="product-title">${checkoutData.productName}</h1>
    <p data-testid="product-price">$${checkoutData.productPrice}</p>
    <button type="button" data-testid="add-to-cart-btn">Add to cart</button>
    <script>
      const badge = document.querySelector('[data-testid="cart-badge"]');
      const button = document.querySelector('button');
      button.addEventListener('click', () => {
        localStorage.setItem('cartItems', JSON.stringify([
          {
            name: '${checkoutData.productName}',
            price: ${checkoutData.productPrice}
          }
        ]));
        localStorage.setItem('cartCount', '1');
        localStorage.setItem('cartTotal', '$${checkoutData.expectedTotal}');
        badge.textContent = '1';
      });
      const currentCount = localStorage.getItem('cartCount');
      if (currentCount) {
        badge.textContent = currentCount;
      }
    </script>
  `;
}

/**
 * Mocks a cart page with cart items and checkout action.
 */
function cartHtml(): string {
  return `
    <div data-testid="cart-items"></div>
    <div data-testid="cart-summary"></div>
    <script>
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const itemsContainer = document.querySelector('[data-testid="cart-items"]');
      const summaryContainer = document.querySelector('[data-testid="cart-summary"]');

      itemsContainer.innerHTML = cartItems.map((item) => \
        \`<div data-testid="cart-item">\${item.name}</div>\`
      ).join('');

      const total = cartItems.reduce((sum, item) => sum + item.price, 0);
      summaryContainer.innerHTML = \`
        <span data-testid="cart-total">$\${total}</span>
        <button type="button" data-testid="checkout-btn">Checkout</button>
      \`;

      summaryContainer.querySelector('[data-testid="checkout-btn"]').addEventListener('click', () => {
        window.location.href = '/checkout';
      });
    </script>
  `;
}

/**
 * Mocks a checkout page where total can be verified before placing order.
 */
function checkoutHtml(): string {
  return `
    <div>
      <span data-testid="checkout-total"></span>
      <button type="button">Place order</button>
      <div role="status" hidden>Order placed</div>
      <script>
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        document.querySelector('[data-testid="checkout-total"]').textContent = '$' + total;
        const placeOrderButton = document.querySelector('button');
        const status = document.querySelector('[role="status"]');
        placeOrderButton.addEventListener('click', () => {
          placeOrderButton.setAttribute('disabled', 'true');
          status.hidden = false;
        });
      </script>
    </div>
  `;
}

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/search', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: searchHtml(),
      });
    });

    await page.route('**/product/1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: productHtml(),
      });
    });

    await page.route('**/cart', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: cartHtml(),
      });
    });

    await page.route('**/checkout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: checkoutHtml(),
      });
    });
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/search');
    await page.unroute('**/product/1');
    await page.unroute('**/cart');
    await page.unroute('**/checkout');
  });

  test('should increment cart badge and keep checkout total equal to expected amount', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const header = new Header(page);

    // Initialization: open search page
    await searchPage.open();

    // User actions: search, select product, add to cart
    await searchPage.search(checkoutData.productName);
    await searchPage.productResult(checkoutData.productName).click();
    await expect(productPage.title()).toHaveText(checkoutData.productName);
    await expect(productPage.price()).toHaveText(`$${checkoutData.productPrice}`);
    await productPage.addToCart().click();

    // Verification: cart badge increments
    await expect(header.cartBadge()).toHaveText('1');

    // User actions: proceed to checkout
    await productPage.cartLink().click();
    await expect(cartPage.items()).toHaveCount(1);
    await cartPage.proceedToCheckout().click();

    // Verification: total matches expected
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(checkoutPage.total()).toHaveText(checkoutData.expectedTotal);
    await checkoutPage.placeOrder().click();
    await expect(checkoutPage.placeOrder()).toBeDisabled();
    await expect(page.getByRole('status')).toHaveText('Order placed');
  });
});
