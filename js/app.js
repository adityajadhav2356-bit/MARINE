// MARIX Marine Bridge Console — Master Bootstrapper
// Manages global state, Web Audio API sound synthesis, i18n localization,
// dynamic stakeholder state, Voice-First subsystem, and route orchestration

import { I18N } from './data/mockData.js';
import { STAKEHOLDERS } from './data/stakeholders.js';
import { authService } from './services/authService.js';
import { voiceService } from './services/voiceService.js';
import { Router } from './router.js';
import { renderLandingView } from './views/landing.js';
import { renderLoginView } from './views/login.js';
import { renderChatView } from './views/chat.js';
import { renderMapView } from './views/map.js';
import { renderSafetyView } from './views/safety.js';
import { renderRouteView } from './views/route.js';
import { renderResearchView } from './views/research.js';
import { renderAdminView } from './views/admin.js';

// Procedural Web Audio API Sound Synthesizer
class BridgeSoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playMechanicalClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {}
  }

  playTacticalBeep() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  playTacticalChirp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1240, this.audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  playTransmissionSound() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) {}
  }
}

class OrcaBridgeApp {
  constructor() {
    this.currentLang = localStorage.getItem('orca_lang') || 'en';
    this.soundEngine = new BridgeSoundEngine();
    this.router = null;
    this.authService = authService;
    this.voiceService = voiceService;
  }

  init() {
    this.bindStaticUI();
    this.initProfileArea();
    this.initVoiceIntercom();
    this.startLiveClocks();

    const routes = {
      '/': renderLandingView,
      '/login': renderLoginView,
      '/chat': renderChatView,
      '/map': renderMapView,
      '/safety': renderSafetyView,
      '/route': renderRouteView,
      '/research': renderResearchView,
      '/admin': renderAdminView
    };

    this.router = new Router(routes, {
      i18n: I18N[this.currentLang] || I18N.en,
      soundEngine: this.soundEngine,
      currentLang: this.currentLang,
      authService: this.authService,
      voiceService: this.voiceService
    });

    this.router.init();
    this.updateStaticTranslations();

    // Listen for auth state changes from anywhere in the app
    window.addEventListener('marix:auth-changed', (e) => {
      this.updateProfileDisplay(e.detail.user);
      this.populateDropdownRoles();
      if (this.router) {
        this.router.refresh();
      }
    });
  }

  bindStaticUI() {
    // Sound Toggle Button
    const audioBtn = document.getElementById('btn-sound-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isSoundOn = this.soundEngine.toggleSound();
        audioBtn.classList.toggle('sound-on', isSoundOn);
        audioBtn.innerHTML = isSoundOn ? '🔊' : '🔇';
        if (isSoundOn) this.soundEngine.playTacticalBeep();
      });
    }

    // Language Switcher Buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang && lang !== this.currentLang) {
          this.setLanguage(lang);
          this.soundEngine.playMechanicalClick();
        }
      });
    });

    // Console Rail navigation sound feedback
    const navLinks = document.querySelectorAll('.rail-nav-item');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.soundEngine.playMechanicalClick();
      });
    });
  }

  initProfileArea() {
    const badgeBtn = document.getElementById('top-profile-badge');
    const dropdown = document.getElementById('profile-dropdown-menu');
    const logoutBtn = document.getElementById('dropdown-btn-logout');

    const currentUser = this.authService.getCurrentUser();
    this.updateProfileDisplay(currentUser);
    this.populateDropdownRoles();

    if (badgeBtn && dropdown) {
      badgeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.soundEngine.playMechanicalClick();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#top-profile-container')) {
          dropdown.classList.remove('open');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.soundEngine.playTacticalChirp();
        dropdown.classList.remove('open');
        this.authService.logout();
      });
    }
  }

  initVoiceIntercom() {
    const voiceBtn = document.getElementById('btn-global-voice');
    const hudOverlay = document.getElementById('voice-hud-overlay');
    const closeBtn = document.getElementById('btn-close-voice-hud');
    const cancelBtn = document.getElementById('btn-cancel-voice');
    const transmitBtn = document.getElementById('btn-transmit-voice');
    const transcriptEl = document.getElementById('voice-hud-transcript');
    const statusEl = document.getElementById('voice-hud-status');
    const langEl = document.getElementById('voice-hud-lang');

    let currentSpokenText = '';

    const openHUD = () => {
      if (!hudOverlay) return;
      hudOverlay.classList.add('open');
      if (voiceBtn) voiceBtn.classList.add('recording');
      this.soundEngine.playTacticalChirp();

      const langMap = { en: 'ENGLISH (en-IN)', hi: 'हिन्दी (hi-IN)', mr: 'मराठी (mr-IN)' };
      if (langEl) langEl.innerHTML = `LANG: <strong class="text-amber">${langMap[this.currentLang] || 'ENGLISH'}</strong>`;
      if (statusEl) statusEl.textContent = 'LISTENING... SPEAK MARITIME QUERY OR COMMAND';
      if (transcriptEl) transcriptEl.textContent = '"Speak now (e.g. \'Assess cyclone risk\' or \'Open marine map\')..."';

      currentSpokenText = '';

      this.voiceService.startListening({
        onInterim: (text) => {
          currentSpokenText = text;
          if (transcriptEl) transcriptEl.textContent = `"${text}"`;
          if (statusEl) statusEl.textContent = 'RECEIVING VHF TRANSMISSION...';
        },
        onFinal: (text) => {
          currentSpokenText = text;
          if (transcriptEl) transcriptEl.textContent = `"${text}"`;
          if (statusEl) statusEl.textContent = '✓ TRANSMISSION COMPLETE — CLICK TRANSMIT';
        },
        onEnd: () => {
          if (statusEl) statusEl.textContent = 'TRANSMISSION READY';
        },
        onError: (err) => {
          if (statusEl) statusEl.textContent = `VOICE NOTE: ${err || 'No speech detected'}`;
        }
      });
    };

    const closeHUD = () => {
      if (!hudOverlay) return;
      hudOverlay.classList.remove('open');
      if (voiceBtn) voiceBtn.classList.remove('recording');
      this.voiceService.stopListening();
      this.soundEngine.playMechanicalClick();
    };

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (hudOverlay && hudOverlay.classList.contains('open')) {
          closeHUD();
        } else {
          openHUD();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeHUD);
    if (cancelBtn) cancelBtn.addEventListener('click', closeHUD);

    if (transmitBtn) {
      transmitBtn.addEventListener('click', () => {
        const textToSubmit = currentSpokenText.trim();
        closeHUD();

        if (textToSubmit) {
          // Check for hands-free voice command
          const navCmd = this.voiceService.checkVoiceNavigationCommand(textToSubmit);
          if (navCmd) {
            this.voiceService.speak(navCmd);
            return;
          }

          // Navigate to chat and submit query
          window.location.hash = '#/chat';
          setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            const chatForm = document.getElementById('chat-form');
            if (chatInput && chatForm) {
              chatInput.value = textToSubmit;
              chatForm.dispatchEvent(new Event('submit'));
            }
          }, 350);
        }
      });
    }
  }

  updateProfileDisplay(user) {
    const avatarEl = document.getElementById('top-profile-avatar');
    const nameEl = document.getElementById('top-profile-name');
    const roleEl = document.getElementById('top-profile-role');
    const statusEl = document.getElementById('top-profile-status');
    const coordsEl = document.getElementById('telemetry-gps');

    if (avatarEl) avatarEl.textContent = user.icon || '⚓';
    if (nameEl) nameEl.textContent = user.shortName || user.name || 'Aditya';
    if (roleEl) roleEl.textContent = user.roleTitle || 'Fisherman';
    if (statusEl) {
      statusEl.textContent = user.badge || '● Demo Account';
      statusEl.style.color = user.color || 'var(--phosphor-green)';
    }
    if (coordsEl && user.coordinates) {
      coordsEl.textContent = user.coordinates;
    }
  }

  populateDropdownRoles() {
    const listEl = document.getElementById('dropdown-roles-list');
    if (!listEl) return;

    const currentUser = this.authService.getCurrentUser();
    const dropdown = document.getElementById('profile-dropdown-menu');

    listEl.innerHTML = STAKEHOLDERS.map(s => `
      <div class="dropdown-role-item ${s.id === currentUser.id ? 'active' : ''}" data-role-id="${s.id}">
        <span class="role-item-icon">${s.icon}</span>
        <div class="role-item-info">
          <div class="role-item-name">${s.name}</div>
          <div class="role-item-title font-data" style="color: ${s.color};">${s.roleTitle}</div>
        </div>
        ${s.id === currentUser.id ? '<span class="role-item-check">✓ ACTIVE</span>' : ''}
      </div>
    `).join('');

    listEl.querySelectorAll('.dropdown-role-item').forEach(item => {
      item.addEventListener('click', () => {
        const roleId = item.getAttribute('data-role-id');
        this.soundEngine.playTacticalChirp();
        if (dropdown) dropdown.classList.remove('open');
        this.authService.switchStakeholder(roleId);
      });
    });
  }

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('orca_lang', lang);
    this.voiceService.updateLanguage(lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    this.updateStaticTranslations();

    if (this.router) {
      this.router.options.i18n = I18N[lang] || I18N.en;
      this.router.options.currentLang = lang;
      this.router.refresh();
    }
  }

  updateStaticTranslations() {
    const dict = I18N[this.currentLang] || I18N.en;
    const titleEl = document.getElementById('brand-title-text');
    const subEl = document.getElementById('brand-sub-text');
    if (titleEl) titleEl.innerHTML = `MARIX / ORCA <span>CONSOLE</span>`;
    if (subEl) subEl.textContent = dict.system_subtitle;
  }

  startLiveClocks() {
    const clockEl = document.getElementById('telemetry-clock');
    const coordEl = document.getElementById('telemetry-gps');

    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toISOString().replace('T', ' ').substr(11, 8) + ' UTC';
      if (clockEl) clockEl.textContent = timeStr;
    };

    updateClock();
    setInterval(updateClock, 1000);

    let baseLat = 18.9812;
    let baseLon = 72.8245;
    setInterval(() => {
      const latOffset = (Math.random() - 0.5) * 0.0004;
      const lonOffset = (Math.random() - 0.5) * 0.0004;
      baseLat += latOffset;
      baseLon += lonOffset;
      if (coordEl && !this.authService.getCurrentUser().coordinates) {
        coordEl.textContent = `${baseLat.toFixed(4)}°N, ${baseLon.toFixed(4)}°E`;
      }
    }, 4000);
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.OrcaApp = new OrcaBridgeApp();
  window.OrcaApp.init();
});
