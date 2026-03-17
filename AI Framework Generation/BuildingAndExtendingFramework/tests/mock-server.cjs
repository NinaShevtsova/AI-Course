const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.env.PORT || 3000);

const state = {
  user: {
    email: process.env.E2E_USER_EMAIL || 'qa.user@example.com',
    password: process.env.E2E_USER_PASSWORD || 'OldPass123',
    username: process.env.E2E_PROFILE_USERNAME || 'QA User',
    avatarSrc: '/images/default-avatar.svg',
  },
  messages: {
    invalidCredentials: process.env.E2E_INVALID_CREDENTIALS_MESSAGE || 'Invalid credentials',
    requiredField: process.env.E2E_REQUIRED_FIELD_MESSAGE || 'Required',
    profileUpdated: process.env.E2E_PROFILE_SUCCESS_MESSAGE || 'Profile updated successfully',
  },
};

const avatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#d9e2ec"/><circle cx="60" cy="45" r="24" fill="#9fb3c8"/><rect x="26" y="76" width="68" height="30" rx="15" fill="#9fb3c8"/></svg>';

function pageTemplate(title, body, extraScript = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Segoe UI, sans-serif; margin: 24px; color: #222; }
    .container { max-width: 760px; margin: 0 auto; }
    .field { margin-bottom: 12px; }
    label { display: block; margin-bottom: 4px; }
    input, select, button { padding: 8px 10px; font-size: 14px; }
    button { cursor: pointer; }
    .error { color: #b00020; font-size: 13px; margin-top: 4px; }
    .success { color: #0a7a35; margin-top: 12px; }
    .row { display: flex; gap: 12px; align-items: center; }
    img { border-radius: 50%; object-fit: cover; }
  </style>
</head>
<body>
  <div class="container">
    ${body}
  </div>
  ${extraScript ? `<script>${extraScript}</script>` : ''}
</body>
</html>`;
}

function loginPage() {
  const body = `
    <h1>Login</h1>
    <form id="login-form">
      <div class="field">
        <label for="email">Email</label>
        <input id="email" aria-label="Email" name="email" type="email" />
        <div id="email-error" class="error" hidden>${state.messages.requiredField}</div>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" aria-label="Password" name="password" type="password" />
        <div id="password-error" class="error" hidden>${state.messages.requiredField}</div>
      </div>
      <button type="submit">Sign in</button>
      <div role="alert" id="login-alert" class="error" hidden></div>
    </form>
  `;

  const script = `
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const alertNode = document.getElementById('login-alert');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    function showFieldError(input, errorNode, visible) {
      errorNode.hidden = !visible;
      if (visible) {
        input.setAttribute('aria-describedby', errorNode.id);
      } else {
        input.removeAttribute('aria-describedby');
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      alertNode.hidden = true;
      alertNode.textContent = '';

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      const emailMissing = !email;
      const passwordMissing = !password;
      showFieldError(emailInput, emailError, emailMissing);
      showFieldError(passwordInput, passwordError, passwordMissing);

      if (emailMissing || passwordMissing) {
        return;
      }

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
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

function homePage() {
  const body = `
    <h1>Home</h1>
    <p>Welcome to the mock app used for Playwright framework tests.</p>
    <div class="field">
      <label for="search">Search</label>
      <input id="search" aria-label="Search" type="text" />
    </div>
    <button type="button">Submit</button>
    <p><a href="/profile">Open profile</a></p>
  `;

  return pageTemplate('Home', body);
}

function profilePage() {
  const body = `
    <h1>Profile</h1>
    <form id="profile-form">
      <div class="field">
        <label for="username">Username</label>
        <input id="username" aria-label="Username" data-testid="username" value="${state.user.username}" />
      </div>
      <div class="field">
        <label for="profile-email">Email</label>
        <input id="profile-email" aria-label="Email" data-testid="email" value="${state.user.email}" />
      </div>
      <div class="field">
        <label for="current-password">Current password</label>
        <input id="current-password" aria-label="Current password" type="password" />
      </div>
      <div class="field">
        <label for="new-password">New password</label>
        <input id="new-password" aria-label="New password" type="password" />
      </div>
      <div class="field">
        <label for="avatar-input">Avatar</label>
        <input id="avatar-input" data-testid="avatar-input" type="file" accept="image/*" />
      </div>
      <div class="row">
        <img data-testid="profile-avatar" src="${state.user.avatarSrc}" width="120" height="120" alt="Profile avatar" />
        <button data-testid="remove-avatar" type="button">Remove avatar</button>
      </div>
      <button data-testid="save-profile" type="submit">Save changes</button>
      <div role="status" aria-label="Profile updated successfully" class="success" hidden>
        ${state.messages.profileUpdated}
      </div>
    </form>
  `;

  const script = `
    if (sessionStorage.getItem('auth') !== 'true') {
      window.location.href = '/login';
    }

    const form = document.getElementById('profile-form');
    const username = document.getElementById('username');
    const email = document.getElementById('profile-email');
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const avatarInput = document.getElementById('avatar-input');
    const avatar = document.querySelector('[data-testid="profile-avatar"]');
    const removeAvatarButton = document.querySelector('[data-testid="remove-avatar"]');
    const status = document.querySelector('[role="status"]');

    avatarInput.addEventListener('change', () => {
      const files = avatarInput.files;
      if (files && files.length > 0) {
        avatar.setAttribute('src', '/images/uploaded-avatar.svg');
      }
    });

    removeAvatarButton.addEventListener('click', () => {
      avatar.setAttribute('src', '/images/default-avatar.svg');
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.hidden = true;

      const payload = {
        username: username.value.trim(),
        email: email.value.trim(),
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        avatarSrc: avatar.getAttribute('src'),
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        status.hidden = false;
      }
    });
  `;

  return pageTemplate('Profile', body, script);
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

  if (req.method === 'GET' && url === '/profile') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(profilePage());
    return;
  }

  if (req.method === 'GET' && url === '/images/default-avatar.svg') {
    res.writeHead(200, { 'content-type': 'image/svg+xml; charset=utf-8' });
    res.end(avatarSvg);
    return;
  }

  if (req.method === 'GET' && url === '/images/uploaded-avatar.svg') {
    const uploadedPath = path.join(__dirname, 'e2e', 'assets', 'avatar.svg');
    const uploaded = fs.existsSync(uploadedPath) ? fs.readFileSync(uploadedPath, 'utf8') : avatarSvg;
    res.writeHead(200, { 'content-type': 'image/svg+xml; charset=utf-8' });
    res.end(uploaded);
    return;
  }

  if (req.method === 'POST' && url === '/api/login') {
    const body = await readBody(req);
    const isValid = body.email === state.user.email && body.password === state.user.password;

    if (!isValid) {
      res.writeHead(401, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ message: state.messages.invalidCredentials }));
      return;
    }

    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'POST' && url === '/api/profile') {
    const body = await readBody(req);
    if (body.username) {
      state.user.username = body.username;
    }
    if (body.email) {
      state.user.email = body.email;
    }
    if (body.newPassword && body.currentPassword === state.user.password) {
      state.user.password = body.newPassword;
    }
    if (body.avatarSrc) {
      state.user.avatarSrc = body.avatarSrc;
    }

    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, message: state.messages.profileUpdated }));
    return;
  }

  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(port, () => {
  process.stdout.write(`Mock server listening on http://localhost:${port}\n`);
});
