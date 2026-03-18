const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 3000);

const initialState = {
  user: {
    username: 'qa.user',
    password: 'Secret123',
  },
  cart: [],
  messages: {
    invalidCredentials: 'Invalid credentials',
  },
};

function cloneState() {
  return JSON.parse(JSON.stringify(initialState));
}

let state = cloneState();

function pageTemplate(title, body, extraScript = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Segoe UI, sans-serif; margin: 0; padding: 0; color: #222; }
    header { background: #2a3f5f; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    .field { margin-bottom: 12px; }
    label { display: block; margin-bottom: 4px; font-weight: 500; }
    input, select, button { padding: 8px 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px; }
    button { cursor: pointer; background: #2a3f5f; color: white; border: none; padding: 10px 16px; }
    button:hover { background: #1e2d42; }
    .error { color: #b00020; font-size: 13px; margin-top: 4px; }
    .success { color: #0a7a35; margin-top: 12px; }
    .product { border: 1px solid #e0e0e0; padding: 16px; margin-bottom: 16px; border-radius: 4px; }
    .product-name { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
    .product-price { font-size: 18px; font-weight: bold; color: #2a3f5f; margin-bottom: 12px; }
    .cart-item { border: 1px solid #e0e0e0; padding: 12px; margin-bottom: 12px; border-radius: 4px; }
    .cart-total { font-size: 18px; font-weight: bold; padding: 16px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px; }
    .cart-badge { background: #d32f2f; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
    .header-nav { display: flex; gap: 16px; align-items: center; }
    .search-container { display: flex; gap: 8px; flex: 1; max-width: 400px; }
    .search-container input { flex: 1; }
  </style>
</head>
<body>
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
  <div class="container">
    ${body}
  </div>
  ${extraScript ? `<script>${extraScript}</script>` : ''}
</body>
</html>`;
}

function homePage() {
  const body = `
    <h1>Welcome to E2E Test Shop</h1>
    <p>Browse our products and add them to your cart.</p>
  `;

  const script = `
    const cartBadge = document.querySelector('[data-testid="cart-badge"]');
    const signInBtn = document.getElementById('sign-in-btn');
    
    function updateCartBadge() {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
    
    if (sessionStorage.getItem('auth') === 'true') {
      signInBtn.textContent = 'Sign Out';
      signInBtn.addEventListener('click', () => {
        sessionStorage.removeItem('auth');
        window.location.href = '/';
      });
    } else {
      signInBtn.addEventListener('click', () => {
        window.location.href = '/login';
      });
    }
    
    updateCartBadge();
  `;

  return pageTemplate('Home', body, script);
}

function loginPage() {
  const body = `
    <h1>Login</h1>
    <form id="login-form">
      <div class="field">
        <label for="username">Username</label>
        <input id="username" aria-label="Username" name="username" type="text" />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" aria-label="Password" name="password" type="password" />
      </div>
      <button type="submit">Sign in</button>
      <div role="alert" id="login-alert" class="error" hidden></div>
    </form>
  `;

  const script = `
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const alertNode = document.getElementById('login-alert');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alertNode.hidden = true;
      alertNode.textContent = '';

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = await response.json();
        alertNode.hidden = false;
        alertNode.textContent = payload.message || 'Login failed';
        return;
      }

      sessionStorage.setItem('auth', 'true');
      window.location.href = '/';
    });
  `;

  return pageTemplate('Login', body, script);
}

function searchPage() {
  const body = `
    <h1>Search Results</h1>
    <div id="results"></div>
  `;

  const script = `
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    const resultsDiv = document.getElementById('results');
    const cartBadge = document.querySelector('[data-testid="cart-badge"]');
    
    // Mock products database
    const products = {
      'E2E Backpack': { price: 100, id: 1 },
      'Test Wallet': { price: 50, id: 2 },
      'QA Hat': { price: 30, id: 3 },
      'Automation Shirt': { price: 75, id: 4 },
    };
    
    function updateCartBadge() {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
    
    if (query) {
      const matched = Object.keys(products).filter(name => 
        name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matched.length > 0) {
        resultsDiv.innerHTML = matched.map(name => 
          \`<div data-product="\${name}" class="product">
            <div class="product-name">\${name}</div>
            <div class="product-price">$\${products[name].price}</div>
            <button data-testid="product-\${products[name].id}">View Product</button>
          </div>\`
        ).join('');
        
        matched.forEach(name => {
          const btn = resultsDiv.querySelector(\`[data-product="\${name}"]\`).querySelector('button');
          btn.addEventListener('click', () => {
            window.location.href = \`/product?id=\${products[name].id}\`;
          });
        });
      } else {
        resultsDiv.innerHTML = '<p>No products found.</p>';
      }
    }
    
    updateCartBadge();
  `;

  return pageTemplate('Search Results', body, script);
}

function productPage() {
  const body = `
    <div id="product-content"></div>
  `;

  const script = `
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productContent = document.getElementById('product-content');
    const cartBadge = document.querySelector('[data-testid="cart-badge"]');
    
    const products = {
      1: { name: 'E2E Backpack', price: 100 },
      2: { name: 'Test Wallet', price: 50 },
      3: { name: 'QA Hat', price: 30 },
      4: { name: 'Automation Shirt', price: 75 },
    };
    
    function updateCartBadge() {
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
    
    const product = products[productId];
    if (product) {
      productContent.innerHTML = \`
        <h1 data-testid="product-title">\${product.name}</h1>
        <div class="product-price" data-testid="product-price">$\${product.price}</div>
        <p>This is a high-quality product perfect for testing e2e scenarios.</p>
        <button id="add-to-cart-btn" data-testid="add-to-cart">Add to Cart</button>
        <a href="/cart" id="cart-link">Go to Cart</a>
      \`;
      
      document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        cart.push({ id: productId, name: product.name, price: product.price });
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
      });
    }
    
    updateCartBadge();
  `;

  return pageTemplate('Product', body, script);
}

function cartPage() {
  const body = `
    <h1>Shopping Cart</h1>
    <div id="cart-items"></div>
    <div id="cart-summary"></div>
  `;

  const script = `
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartSummaryDiv = document.getElementById('cart-summary');
    const cartBadge = document.querySelector('[data-testid="cart-badge"]');
    
    function updateCartBadge() {
      if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
    
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
      cartSummaryDiv.innerHTML = '';
    } else {
      cartItemsDiv.innerHTML = \`
        <div data-testid="cart-items">
          \${cart.map((item, idx) => 
            \`<div class="cart-item">
              <div>\${item.name} - $\${item.price}</div>
              <button data-testid="remove-item-\${idx}">Remove</button>
            </div>\`
          ).join('')}
        </div>
      \`;
      
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartSummaryDiv.innerHTML = \`
        <div class="cart-total" data-testid="cart-total">Total: $\${total}</div>
        <button id="checkout-btn" data-testid="proceed-to-checkout">Proceed to Checkout</button>
      \`;
      
      document.getElementById('checkout-btn').addEventListener('click', () => {
        window.location.href = '/checkout';
      });
      
      cart.forEach((item, idx) => {
        const removeBtn = document.querySelector(\`[data-testid="remove-item-\${idx}"]\`);
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            cart.splice(idx, 1);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            window.location.reload();
          });
        }
      });
    }
    
    updateCartBadge();
  `;

  return pageTemplate('Cart', body, script);
}

function checkoutPage() {
  const body = `
    <h1>Checkout</h1>
    <form id="checkout-form">
      <h2>Order Summary</h2>
      <div id="checkout-items"></div>
      <div class="cart-total" data-testid="checkout-total">Total: $0</div>
      
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
  `;

  const script = `
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const checkoutItemsDiv = document.getElementById('checkout-items');
    const checkoutTotalDiv = document.querySelector('[data-testid="checkout-total"]');
    const form = document.getElementById('checkout-form');
    const messageDiv = document.getElementById('checkout-message');
    const cartBadge = document.querySelector('[data-testid="cart-badge"]');
    
    function updateCartBadge() {
      if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
    
    if (cart.length > 0) {
      checkoutItemsDiv.innerHTML = \`
        <div data-testid="checkout-items">
          \${cart.map(item => 
            \`<div class="cart-item">
              <div>\${item.name} - $\${item.price}</div>
            </div>\`
          ).join('')}
        </div>
      \`;
      
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      checkoutTotalDiv.textContent = \`Total: $\${total}\`;
    }
    
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const payload = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        card: document.getElementById('card').value,
      };
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        messageDiv.textContent = 'Order placed successfully!';
        messageDiv.hidden = false;
        sessionStorage.removeItem('cart');
        updateCartBadge();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        messageDiv.textContent = 'Failed to place order';
        messageDiv.hidden = false;
      }
    });
    
    updateCartBadge();
  `;

  return pageTemplate('Checkout', body, script);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'GET' && url === '/login') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(loginPage());
    return;
  }

  if (req.method === 'GET' && url === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(homePage());
    return;
  }

  if (req.method === 'GET' && url.startsWith('/search')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(searchPage());
    return;
  }

  if (req.method === 'GET' && url.startsWith('/product')) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(productPage());
    return;
  }

  if (req.method === 'GET' && url === '/cart') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(cartPage());
    return;
  }

  if (req.method === 'GET' && url === '/checkout') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(checkoutPage());
    return;
  }

  if (req.method === 'POST' && url === '/api/login') {
    const body = await readBody(req);
    const isValid = body.username === 'qa.user' && body.password === 'Secret123';

    if (!isValid) {
      res.writeHead(401, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ message: 'Invalid credentials' }));
      return;
    }

    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'POST' && url === '/api/checkout') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  console.log(`Mock server running on port ${port}`);
});
