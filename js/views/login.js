// MARIX Marine Bridge Console — Demo Login & Stakeholder Gateway (/#/login)
// Features interactive stakeholder role cards, instant auto-fill, one-click demo login,
// and zero-barrier judging/demo flows.

import { STAKEHOLDERS, GUEST_USER } from '../data/stakeholders.js';
import { authService } from '../services/authService.js';

export function renderLoginView(container, { i18n, soundEngine }) {
  const currentStakeholder = authService.getCurrentUser();

  const roleCardsHtml = STAKEHOLDERS.map((s, idx) => `
    <div class="demo-role-card ${s.id === currentStakeholder.id ? 'active-role' : ''}" data-role-id="${s.id}" id="role-card-${s.id}">
      <div class="role-card-header">
        <div class="role-icon-wrapper" style="border-color: ${s.color};">
          <span class="role-icon">${s.icon}</span>
        </div>
        <div class="role-info">
          <div class="role-name">${s.name}</div>
          <div class="role-title" style="color: ${s.color};">${s.roleTitle}</div>
          <div class="role-domain font-data">${s.domain}</div>
        </div>
        <span class="role-number-badge font-data">0${idx + 1}</span>
      </div>

      <!-- Visible but visually secondary demo credentials -->
      <div class="role-cred-box">
        <div class="cred-row">
          <span class="cred-label">EMAIL:</span>
          <span class="cred-val font-data">${s.email}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">KEY:</span>
          <span class="cred-val font-data">${s.password}</span>
        </div>
      </div>

      <div class="role-card-actions">
        <button class="btn-tactical btn-demo-login btn-tactical-amber" data-role-id="${s.id}" id="btn-demo-login-${s.id}">
          <span>⚡</span> DEMO LOGIN
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="login-view-container">
      <!-- Background tactical watermarks -->
      <div class="login-backdrop-glow"></div>

      <!-- Top Headline -->
      <div class="login-header-section">
        <div class="hero-wordmark-plate" style="margin-bottom: 8px;">
          <span class="beacon-pulse"></span>
          <span class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em;">
            MARIX MARITIME AUTHENTICATION &amp; ACCESS CONTROL
          </span>
        </div>
        <h1 class="font-display text-parchment-bright" style="font-size: 2rem; font-weight: 700; margin-bottom: 6px;">
          Stakeholder Access Gateway
        </h1>
        <p class="font-data text-muted" style="font-size: 0.80rem; max-width: 680px; text-align: center; line-height: 1.5;">
          Select any pre-configured stakeholder demo account to launch the customized Autonomous Marine Intelligence bridge with specialized domain datasets, telemetry, and AI reasoning.
        </p>
      </div>

      <!-- Main Login Grid: Primary Credentials Terminal + Demo Role Cards -->
      <div class="login-main-grid">
        <!-- Left: Primary Login Terminal -->
        <div class="bezel-panel login-form-panel">
          <div class="panel-header">
            <span class="panel-title">
              <span class="icon">⚓</span> MARIX CONSOLE LOGIN
            </span>
            <span class="panel-badge badge-green">DEMO READY</span>
          </div>

          <div class="panel-body">
            <form id="marix-login-form" class="login-form-inner">
              <div class="form-group">
                <label class="form-label" for="login-email">OPERATIONAL EMAIL / CALLSIGN</label>
                <div class="input-with-icon">
                  <span class="input-icon">👤</span>
                  <input
                    type="email"
                    id="login-email"
                    class="tactical-input font-data"
                    placeholder="e.g. fisherman@marix.demo"
                    value="${currentStakeholder.email || 'fisherman@marix.demo'}"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">BRIDGE SECURITY KEY / PASSCODE</label>
                <div class="input-with-icon">
                  <span class="input-icon">🔑</span>
                  <input
                    type="password"
                    id="login-password"
                    class="tactical-input font-data"
                    placeholder="Enter password..."
                    value="${currentStakeholder.password || 'MARIX@123'}"
                    required
                  />
                </div>
              </div>

              <!-- Primary Submit -->
              <button type="submit" class="btn-tactical btn-tactical-amber btn-lg" id="btn-submit-login" style="width: 100%; justify-content: center; padding: 12px 18px; font-size: 0.88rem; font-weight: 700;">
                <span>🔐</span> AUTHENTICATE TO BRIDGE
              </button>
            </form>

            <!-- Quick Judging & Evaluation Shortcuts -->
            <div class="quick-judge-divider">
              <span>OR QUICK DEMO &amp; JUDGING FLOW</span>
            </div>

            <div class="quick-judge-actions">
              <button class="btn-tactical btn-tactical-green" id="btn-quick-demo-user" style="width: 100%; justify-content: center; padding: 10px 14px;">
                <span>⚡</span> LOGIN AS DEMO USER
              </button>
              <button class="btn-tactical" id="btn-continue-guest" style="width: 100%; justify-content: center; padding: 10px 14px;">
                <span>🌐</span> CONTINUE WITHOUT LOGIN
              </button>
            </div>

            <!-- Security & Zero Verification Notice -->
            <div class="demo-auth-disclaimer font-data">
              <div class="text-brass" style="font-weight: 700; margin-bottom: 2px;">
                ● INSTANT ZERO-VERIFICATION DEMO MODE
              </div>
              <div>No real credentials, OTP, or backend verification required. Click any role card below to populate and login immediately.</div>
            </div>
          </div>
        </div>

        <!-- Right: Demo Login Section with 6 Clickable Stakeholder Cards -->
        <div class="demo-stakeholders-section">
          <div class="section-title-bar">
            <div class="font-data text-brass" style="font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; display: flex; align-items: center; gap: 8px;">
              <span>👥</span> PRE-CONFIGURED STAKEHOLDER DEMO ACCOUNTS (6 ROLES)
            </div>
            <span class="panel-badge badge-amber">CLICK ANY ROLE TO INSTANT LOGIN</span>
          </div>

          <div class="demo-cards-grid">
            ${roleCardsHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Interactions
  const form = container.querySelector('#marix-login-form');
  const emailInput = container.querySelector('#login-email');
  const passwordInput = container.querySelector('#login-password');
  const submitBtn = container.querySelector('#btn-submit-login');
  const quickDemoBtn = container.querySelector('#btn-quick-demo-user');
  const guestBtn = container.querySelector('#btn-continue-guest');

  // Standard Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (soundEngine) soundEngine.playTransmissionSound();
    performLogin(emailInput.value, passwordInput.value);
  });

  // "Login as Demo User" button
  quickDemoBtn.addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalChirp();
    const defaultUser = STAKEHOLDERS[0];
    autoPopulateAndLogin(defaultUser);
  });

  // "Continue without Login" button
  guestBtn.addEventListener('click', () => {
    if (soundEngine) soundEngine.playMechanicalClick();
    authService.continueWithoutLogin();
    window.location.hash = '#/';
  });

  // Clickable Role Cards & "Demo Login" buttons
  container.querySelectorAll('.demo-role-card').forEach(card => {
    const roleId = card.getAttribute('data-role-id');
    const roleObj = STAKEHOLDERS.find(s => s.id === roleId);
    if (!roleObj) return;

    // Entire card click or button click triggers auto-populate and instant login
    card.addEventListener('click', (e) => {
      // Prevent double firing if clicking button specifically
      if (soundEngine) soundEngine.playTacticalChirp();
      autoPopulateAndLogin(roleObj);
    });
  });

  function autoPopulateAndLogin(stakeholder) {
    // Highlight active card
    container.querySelectorAll('.demo-role-card').forEach(c => c.classList.remove('active-role'));
    const targetCard = container.querySelector(`#role-card-${stakeholder.id}`);
    if (targetCard) targetCard.classList.add('active-role');

    // Visual auto-population animation
    emailInput.classList.add('input-populating');
    passwordInput.classList.add('input-populating');
    emailInput.value = stakeholder.email;
    passwordInput.value = stakeholder.password;

    submitBtn.innerHTML = `<span>⏳</span> ACCESSING AS ${stakeholder.roleTitle.toUpperCase()}...`;
    submitBtn.classList.remove('btn-tactical-amber');
    submitBtn.classList.add('btn-tactical-green');

    setTimeout(() => {
      authService.demoLogin(stakeholder.id);
      window.location.hash = '#/';
    }, 320);
  }

  function performLogin(email, password) {
    submitBtn.innerHTML = `<span>⏳</span> AUTHENTICATING...`;
    submitBtn.classList.remove('btn-tactical-amber');
    submitBtn.classList.add('btn-tactical-green');

    setTimeout(() => {
      authService.login(email, password);
      window.location.hash = '#/';
    }, 280);
  }
}
