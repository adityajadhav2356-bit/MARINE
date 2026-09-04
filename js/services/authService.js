// MARIX Authentication & Stakeholder State Service
// Manages demo login credentials, instantaneous role switches, guest modes,
// and state broadcast across all UI modules.

import { STAKEHOLDERS, GUEST_USER } from '../data/stakeholders.js';

export class AuthService {
  constructor() {
    this.currentUser = this.loadInitialUser();
  }

  loadInitialUser() {
    const savedId = localStorage.getItem('marix_auth_user_id');
    if (!savedId) {
      // Default to Fisherman demo account for instant out-of-the-box immersion
      const defaultUser = STAKEHOLDERS[0];
      localStorage.setItem('marix_auth_user_id', defaultUser.id);
      return defaultUser;
    }

    if (savedId === 'guest') {
      return GUEST_USER;
    }

    const found = STAKEHOLDERS.find(s => s.id === savedId);
    return found || STAKEHOLDERS[0];
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getAllStakeholders() {
    return STAKEHOLDERS;
  }

  getStakeholderById(id) {
    return STAKEHOLDERS.find(s => s.id === id) || null;
  }

  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Match with pre-configured stakeholder credentials
    const matched = STAKEHOLDERS.find(s => 
      s.email.toLowerCase() === cleanEmail && s.password === cleanPass
    );

    if (matched) {
      return this.setUser(matched);
    }

    // Match by email prefix (e.g. fisherman)
    const matchedByPrefix = STAKEHOLDERS.find(s => 
      cleanEmail.includes(s.id) || cleanEmail.startsWith(s.id)
    );

    if (matchedByPrefix) {
      return this.setUser(matchedByPrefix);
    }

    // For any custom email entered in demo mode without error barriers:
    const fallbackUser = {
      ...STAKEHOLDERS[0],
      email: cleanEmail || STAKEHOLDERS[0].email,
      name: cleanEmail ? cleanEmail.split('@')[0].toUpperCase() : STAKEHOLDERS[0].name
    };
    return this.setUser(fallbackUser);
  }

  demoLogin(stakeholderId) {
    const stakeholder = STAKEHOLDERS.find(s => s.id === stakeholderId);
    if (stakeholder) {
      return this.setUser(stakeholder);
    }
    return this.setUser(STAKEHOLDERS[0]);
  }

  loginAsDefaultDemo() {
    return this.setUser(STAKEHOLDERS[0]); // Fisherman Aditya
  }

  continueWithoutLogin() {
    return this.setUser(GUEST_USER);
  }

  switchStakeholder(stakeholderId) {
    return this.demoLogin(stakeholderId);
  }

  logout() {
    localStorage.removeItem('marix_auth_user_id');
    this.currentUser = GUEST_USER;
    this.broadcastAuthChange(GUEST_USER);
    window.location.hash = '#/login';
  }

  setUser(user) {
    const prev = this.currentUser;
    this.currentUser = user;
    localStorage.setItem('marix_auth_user_id', user.id);
    this.broadcastAuthChange(user, prev);
    return user;
  }

  broadcastAuthChange(user, prev = null) {
    const event = new CustomEvent('marix:auth-changed', {
      detail: { user, previousUser: prev }
    });
    window.dispatchEvent(event);
  }
}

// Global singleton instance
export const authService = new AuthService();
