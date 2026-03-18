# Exercise 2 - Prompt

You are an experienced Senior QA Automation Engineer with expertise in TypeScript and Playwright E2E testing
Extend the existing framework with the tests adding files to a target repository:

Project & framework:
Stack: TypeScript + Playwright

Structure:
tests/e2e/checkout.spec.{{ext}}
src/pages/SearchPage.{{ext}}, src/pages/ProductPage.{{ext}}, src/pages/CartPage.{{ext}}, src/pages/CheckoutPage.{{ext}}
src/components/Header.{{ext}}
src/fixtures/testData.{{ext}}

Optional DOM context (outerHTML):

<div data-testid="cart-summary"> <span data-testid="cart-total">$100</span> <button data-testid="checkout-btn">Checkout</button> </div> Task:

SearchPage: queryInput(), submit(), productResult(name)
ProductPage: addToCart(), title(), price()
CartPage: items(), proceedToCheckout()
CheckoutPage: total(), placeOrder()
Header: cartBadge()
Test (checkout.spec):
// Initialization: open search page
// User actions: search, select product, add to cart
// Verification: cart badge increments
// User actions: proceed to checkout
// Verification: total matches expected
