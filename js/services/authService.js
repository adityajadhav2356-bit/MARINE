// MARIX Authentication & Stakeholder State Service
// Supabase-backed authentication with a local demo-role compatibility layer.
import { STAKEHOLDERS, GUEST_USER } from '../data/stakeholders.js';
import { supabase } from './supabaseClient.js';

export class AuthService {
  constructor() {
    this.currentUser = GUEST_USER;
    this.session = null;
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    const { data } = await supabase.auth.getSession();
    await this.applySession(data?.session || null, false);

    supabase.auth.onAuthStateChange(async (_event, session) => {
      await this.applySession(session, true);
    });
    this.initialized = true;
  }

  async applySession(session, broadcast = true) {
    const previousUser = this.currentUser;
    this.session = session;

    if (!session?.user) {
      this.currentUser = GUEST_USER;
    } else {
      const metadata = session.user.user_metadata || {};
      const role = metadata.role || 'operator';
      const matchedStakeholder = STAKEHOLDERS.find(s => s.roleTitle?.toLowerCase() === role.toLowerCase());
      this.currentUser = {
        ...(matchedStakeholder || STAKEHOLDERS[0]),
        id: session.user.id,
        email: session.user.email || '',
        name: metadata.full_name || session.user.email?.split('@')[0] || 'MARIX User',
        shortName: metadata.full_name || session.user.email?.split('@')[0] || 'MARIX User',
        roleTitle: role === 'operator' ? 'Marine Operator' : (matchedStakeholder?.roleTitle || role),
        badge: '● Authenticated User'
      };
    }

    if (broadcast) this.broadcastAuthChange(this.currentUser, previousUser);
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

  isAuthenticated() {
    return !!this.session?.user;
  }

  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    if (!cleanEmail || !cleanPass) return { user: null, error: 'Email and password are required.' };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });

    if (error) return { user: null, error: error.message };
    await this.applySession(data.session, true);
    return { user: this.currentUser, error: null };
  }

  async signUp(email, password, fullName = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPass,
      options: { data: { full_name: fullName.trim() } }
    });
    if (error) return { user: null, error: error.message };
    if (data.session) await this.applySession(data.session, true);
    return {
      user: data.user,
      error: null,
      needsEmailConfirmation: !data.session
    };
  }

  async demoLogin(stakeholderId) {
    // Demo roles remain available for judging without pretending they are real accounts.
    // Real accounts must use Supabase Auth via login()/signUp().
    const stakeholder = STAKEHOLDERS.find(s => s.id === stakeholderId);
    if (stakeholder) {
      this.setDemoUser(stakeholder);
      return { user: stakeholder, error: null, demo: true };
    }
    return { user: null, error: 'Demo stakeholder not found.' };
  }

  async loginAsDefaultDemo() {
    return this.demoLogin(STAKEHOLDERS[0].id);
  }

  continueWithoutLogin() {
    this.setUser(GUEST_USER);
    return GUEST_USER;
  }

  switchStakeholder(stakeholderId) {
    return this.demoLogin(stakeholderId);
  }

  async logout() {
    await supabase.auth.signOut();
    this.currentUser = GUEST_USER;
    this.session = null;
    localStorage.removeItem('marix_auth_user_id');
    this.broadcastAuthChange(GUEST_USER);
    window.location.hash = '#/login';
  }

  setDemoUser(user) {
    this.currentUser = user;
    localStorage.setItem('marix_auth_user_id', user.id);
    this.broadcastAuthChange(user);
    return user;
  }

  setUser(user) {
    return this.setDemoUser(user);
  }

  broadcastAuthChange(user, prev = null) {
    window.dispatchEvent(new CustomEvent('marix:auth-changed', {
      detail: { user, previousUser: prev }
    }));
  }
}

export const authService = new AuthService();
