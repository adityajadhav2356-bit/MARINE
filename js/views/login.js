// MARIX Marine Bridge Console — Supabase Authentication Gateway
import { STAKEHOLDERS } from '../data/stakeholders.js';
import { authService } from '../services/authService.js';

export function renderLoginView(container, { soundEngine }) {
  const current = authService.getCurrentUser();
  const roleCards = STAKEHOLDERS.map((s, i) => `
    <button class="demo-role-card" type="button" data-role-id="${s.id}" style="text-align:left; width:100%;">
      <div class="role-card-header">
        <div class="role-icon-wrapper" style="border-color:${s.color};"><span class="role-icon">${s.icon}</span></div>
        <div class="role-info"><div class="role-name">${s.name}</div><div class="role-title" style="color:${s.color};">${s.roleTitle}</div><div class="role-domain font-data">${s.domain}</div></div>
        <span class="role-number-badge font-data">0${i + 1}</span>
      </div>
      <div class="role-card-actions"><span class="btn-tactical btn-tactical-amber">⚡ DEMO ACCESS</span></div>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="login-view-container">
      <div class="login-backdrop-glow"></div>
      <div class="login-header-section">
        <div class="hero-wordmark-plate" style="margin-bottom:8px;"><span class="beacon-pulse"></span><span class="font-data text-brass" style="font-size:.72rem;font-weight:700;letter-spacing:.12em;">MARIX MARITIME AUTHENTICATION &amp; ACCESS CONTROL</span></div>
        <h1 class="font-display text-parchment-bright" style="font-size:2rem;font-weight:700;margin-bottom:6px;">Stakeholder Access Gateway</h1>
        <p class="font-data text-muted" style="font-size:.8rem;max-width:680px;text-align:center;line-height:1.5;">Create a real MARIX account or sign in to your existing account. Your operational data is protected by Supabase authentication and row-level security.</p>
      </div>

      <div class="login-main-grid">
        <div class="bezel-panel login-form-panel">
          <div class="panel-header"><span class="panel-title"><span class="icon">⚓</span> MARIX CONSOLE LOGIN</span><span class="panel-badge badge-green">SUPABASE AUTH</span></div>
          <div class="panel-body">
            <form id="marix-login-form" class="login-form-inner">
              <div class="form-group"><label class="form-label" for="login-name">FULL NAME (FOR NEW ACCOUNT)</label><input id="login-name" class="tactical-input font-data" placeholder="e.g. Aditya Jadhav" autocomplete="name"></div>
              <div class="form-group"><label class="form-label" for="login-email">EMAIL</label><input type="email" id="login-email" class="tactical-input font-data" placeholder="you@example.com" value="${current.email && !current.email.includes('.demo') ? current.email : ''}" required autocomplete="email"></div>
              <div class="form-group"><label class="form-label" for="login-password">PASSWORD</label><input type="password" id="login-password" class="tactical-input font-data" placeholder="Minimum 6 characters" required autocomplete="current-password"></div>
              <div id="auth-status" class="font-data text-muted" style="min-height:24px;margin:8px 0;"></div>
              <button type="submit" class="btn-tactical btn-tactical-amber btn-lg" id="btn-submit-login" style="width:100%;justify-content:center;padding:12px 18px;">🔐 SIGN IN</button>
            </form>
            <div class="quick-judge-divider"><span>NEW TO MARIX?</span></div>
            <button class="btn-tactical btn-tactical-green" id="btn-create-account" style="width:100%;justify-content:center;padding:10px 14px;">👤 CREATE REAL ACCOUNT</button>
            <div class="quick-judge-divider"><span>PROJECT DEMO</span></div>
            <button class="btn-tactical" id="btn-continue-guest" style="width:100%;justify-content:center;padding:10px 14px;">🌐 CONTINUE WITHOUT LOGIN</button>
          </div>
        </div>

        <div class="demo-stakeholders-section">
          <div class="section-title-bar"><div class="font-data text-brass" style="font-size:.78rem;font-weight:700;letter-spacing:.1em;">👥 DEMO STAKEHOLDER PROFILES</div><span class="panel-badge badge-amber">FOR PRESENTATION / TESTING</span></div>
          <div class="demo-cards-grid">${roleCards}</div>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#marix-login-form');
  const nameInput = container.querySelector('#login-name');
  const emailInput = container.querySelector('#login-email');
  const passwordInput = container.querySelector('#login-password');
  const status = container.querySelector('#auth-status');
  const submitBtn = container.querySelector('#btn-submit-login');
  const createBtn = container.querySelector('#btn-create-account');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = 'AUTHENTICATING...';
    submitBtn.disabled = true;
    const result = await authService.login(emailInput.value, passwordInput.value);
    submitBtn.disabled = false;
    if (result.error) {
      status.textContent = `⚠ ${result.error}`;
      status.style.color = 'var(--radar-red)';
      return;
    }
    status.textContent = '✓ AUTHENTICATED — OPENING BRIDGE...';
    status.style.color = 'var(--phosphor-green)';
    if (soundEngine) soundEngine.playTransmissionSound();
    window.location.hash = '#/';
  });

  createBtn.addEventListener('click', async () => {
    status.textContent = 'CREATING ACCOUNT...';
    createBtn.disabled = true;
    const result = await authService.signUp(emailInput.value, passwordInput.value, nameInput.value);
    createBtn.disabled = false;
    if (result.error) {
      status.textContent = `⚠ ${result.error}`;
      status.style.color = 'var(--radar-red)';
      return;
    }
    if (result.needsEmailConfirmation) {
      status.textContent = '✓ ACCOUNT CREATED — CHECK YOUR EMAIL TO CONFIRM, THEN SIGN IN.';
    } else {
      status.textContent = '✓ ACCOUNT CREATED — OPENING BRIDGE...';
      window.location.hash = '#/';
    }
    status.style.color = 'var(--phosphor-green)';
  });

  container.querySelector('#btn-continue-guest').addEventListener('click', () => {
    authService.continueWithoutLogin();
    window.location.hash = '#/login';
  });

  container.querySelectorAll('[data-role-id]').forEach(card => {
    card.addEventListener('click', async () => {
      const result = await authService.demoLogin(card.dataset.roleId);
      if (!result.error) window.location.hash = '#/';
    });
  });
}
