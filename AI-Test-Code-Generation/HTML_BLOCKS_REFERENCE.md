# Cart & Checkout HTML Blocks for Locator Guidance

## 1. HEADER WITH CART BADGE

```html
<header>
  <h1 style="margin: 0; font-size: 24px;">E2E Test Shop</h1>
  <div class="header-nav">
    <div class="search-container">
      <input id="search" aria-label="Search" type="text" placeholder="Search products..." />
      <button type="button" id="search-submit">Search</button>
    </div>
    <a href="/" style="color: white; text-decoration: none;">Home</a>
    <a href="/cart" style="color: white; text-decoration: none; display: flex; align-items: center; gap: 8px;">
      Cart
      <span data-testid="cart-badge" class="cart-badge" style="display: none;">0</span>
    </a>
    <button type="button" id="sign-in-btn" style="padding: 6px 12px; font-size: 12px;">Sign In</button>
  </div>
</header>
```

### Locators for Header:
- **Cart Badge**: `page.getByTestId('cart-badge')`
- **Sign In Button**: `page.getByRole('button', { name: 'Sign In' })`

---

## 2. PRODUCT PAGE - "ADD TO CART" AND "GO TO CART"

```html
<h1 data-testid="product-title">E2E Backpack</h1>
<div class="product-price" data-testid="product-price">$100</div>
<p>This is a high-quality product perfect for testing e2e scenarios.</p>
<button id="add-to-cart-btn" data-testid="add-to-cart">Add to Cart</button>
<a href="/cart" id="cart-link">Go to Cart</a>
```

### Locators for Product Page:
- **Add to Cart Button**: `page.getByTestId('add-to-cart')`
- **Product Title**: `page.getByTestId('product-title')`
- **Product Price**: `page.getByTestId('product-price')`
- **Cart Link**: `page.getByRole('link', { name: 'Go to Cart' })` OR `page.locator('a#cart-link')`

---

## 3. CART PAGE - ITEMS AND CHECKOUT BUTTON

```html
<h1>Shopping Cart</h1>
<div id="cart-items">
  <div data-testid="cart-items">
    <div class="cart-item">
      <div>E2E Backpack - $100</div>
      <button data-testid="remove-item-0">Remove</button>
    </div>
  </div>
</div>

<div id="cart-summary">
  <div class="cart-total" data-testid="cart-total">Total: $100</div>
  <button id="checkout-btn" data-testid="proceed-to-checkout">Proceed to Checkout</button>
</div>
```

### Locators for Cart Page:
- **Cart Items Container**: `page.getByTestId('cart-items')`
- **Cart Item (individual)**: `page.locator('.cart-item')` (or use `.nth(0)` for specific)
- **Cart Total**: `page.getByTestId('cart-total')`
- **Remove Item Button**: `page.getByTestId('remove-item-0')`
- **Proceed to Checkout Button**: `page.getByTestId('proceed-to-checkout')`

---

## 4. CHECKOUT PAGE - ITEMS AND TOTAL

```html
<h1>Checkout</h1>
<form id="checkout-form">
  <h2>Order Summary</h2>
  <div id="checkout-items">
    <div data-testid="checkout-items">
      <div class="cart-item">
        <div>E2E Backpack - $100</div>
      </div>
    </div>
  </div>
  <div class="cart-total" data-testid="checkout-total">Total: $100</div>
  
  <h2>Shipping Address</h2>
  <div class="field">
    <label for="name">Full Name</label>
    <input id="name" aria-label="Full Name" name="name" type="text" required />
  </div>
  <div class="field">
    <label for="address">Address</label>
    <input id="address" aria-label="Address" name="address" type="text" required />
  </div>
  <div class="field">
    <label for="city">City</label>
    <input id="city" aria-label="City" name="city" type="text" required />
  </div>
  
  <h2>Payment</h2>
  <div class="field">
    <label for="card">Card Number</label>
    <input id="card" aria-label="Card Number" name="card" type="text" placeholder="4111 1111 1111 1111" required />
  </div>
  
  <button type="submit" id="place-order-btn" data-testid="place-order">Place Order</button>
  <div id="checkout-message" class="success" hidden></div>
</form>
```

### Locators for Checkout Page:
- **Checkout Items Container**: `page.getByTestId('checkout-items')`
- **Checkout Total**: `page.getByTestId('checkout-total')`
- **Full Name Input**: `page.getByLabel('Full Name')`
- **Address Input**: `page.getByLabel('Address')`
- **City Input**: `page.getByLabel('City')`
- **Card Number Input**: `page.getByLabel('Card Number')`
- **Place Order Button**: `page.getByTestId('place-order')` OR `page.getByRole('button', { name: 'Place Order' })`
- **Checkout Message**: `page.locator('#checkout-message')`

---

## 5. CSS CLASS REFERENCE

| Class | Purpose |
|-------|---------|
| `.cart-item` | Individual cart/checkout item wrapper |
| `.cart-total` | Cart total display (used in both cart & checkout) |
| `.cart-badge` | Badge showing cart count in header |
| `.success` | Success message styling |
| `.error` | Error message styling |
| `.field` | Form field wrapper |

---

## 6. DATA-TESTID ATTRIBUTES (For Most Reliable Locators)

| data-testid | Element |
|-------------|---------|
| `cart-badge` | Cart counter in header |
| `add-to-cart` | "Add to Cart" button on product page |
| `product-title` | Product name heading |
| `product-price` | Product price display |
| `cart-items` | Container for cart items |
| `cart-total` | Total amount display in cart |
| `proceed-to-checkout` | "Proceed to Checkout" button |
| `checkout-items` | Container for checkout items |
| `checkout-total` | Total amount display at checkout |
| `place-order` | "Place Order" button |
| `remove-item-{idx}` | Remove button for cart item (indexed) |

---

## 7. RECOMMENDED LOCATOR BEST PRACTICES

✅ **Use These (Stable & Accessible):**
```typescript
// By test ID (most stable)
page.getByTestId('cart-badge')

// By accessible name (semantic)
page.getByRole('button', { name: 'Add to Cart' })
page.getByLabel('Full Name')

// By aria-label (when role-based isn't enough)
page.getByLabel('Search')
```

❌ **Avoid These (Fragile & Not Accessible):**
```typescript
// CSS selectors
page.locator('.cart-badge')  // brittle

// XPath
page.locator('//span[@class="cart-badge"]')

// IDs without meaning
page.locator('#checkout-btn')  // use data-testid instead
```

---

## 8. USAGE EXAMPLES IN PAGE OBJECTS

```typescript
// CartPage.ts
export class CartPage {
  constructor(private page: Page) {}

  cartItems() {
    return this.page.getByTestId('cart-items');
  }

  cartTotal() {
    return this.page.getByTestId('cart-total');
  }

  proceedToCheckout() {
    return this.page.getByTestId('proceed-to-checkout');
  }
}

// Header.ts
export class Header {
  constructor(private page: Page) {}

  cartBadge() {
    return this.page.getByTestId('cart-badge');
  }
}

// CheckoutPage.ts
export class CheckoutPage {
  constructor(private page: Page) {}

  total() {
    return this.page.getByTestId('checkout-total');
  }

  placeOrder() {
    return this.page.getByTestId('place-order');
  }

  fullNameInput() {
    return this.page.getByLabel('Full Name');
  }
}
```

---

## 9. SESSION STORAGE CART DATA STRUCTURE

The mock server uses `sessionStorage` to track cart state:

```javascript
// Cart structure in sessionStorage
JSON.parse(sessionStorage.getItem('cart'))
// Returns:
[
  {
    id: 1,
    name: 'E2E Backpack',
    price: 100
  }
]
```

This is updated when "Add to Cart" is clicked and cleared when checkout completes.
