// ORCA Marine Bridge Console — Hash Router
// Manages client-side routing and protects application routes with Supabase auth.

import { renderLandingView } from './views/landing.js';
import { renderLoginView } from './views/login.js';
import { renderChatView } from './views/chat.js';
import { renderMapView } from './views/map.js';
import { renderSafetyView } from './views/safety.js';
import { renderRouteView } from './views/route.js';
import { renderResearchView } from './views/research.js';
import { renderAdminView } from './views/admin.js';

export class Router {
  constructor(routes, options = {}) {
    this.routes = routes;
    this.options = options;
    this.currentRoute = null;
    this.viewportEl = document.getElementById('app-viewport');

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('marix:auth-changed', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/';
    const cleanRoute = rawHash.replace(/^#/, '') || '/';
    const authService = this.options.authService;
    const publicRoutes = ['/login'];

    // All operational console routes require a real Supabase session.
    // The login page remains public so an unauthenticated user can sign in.
    if (!publicRoutes.includes(cleanRoute) && authService && !authService.isAuthenticated()) {
      if (window.location.hash !== '#/login') window.location.hash = '#/login';
      return;
    }

    const handler = this.routes[cleanRoute] || this.routes['/'] || renderLandingView;
    this.currentRoute = cleanRoute;
    this.updateActiveRail(cleanRoute);

    if (this.viewportEl) {
      this.viewportEl.innerHTML = '';
      handler(this.viewportEl, this.options);
      this.viewportEl.scrollTop = 0;
    }
  }

  updateActiveRail(route) {
    const railItems = document.querySelectorAll('.rail-nav-item');
    railItems.forEach(item => {
      const itemHref = item.getAttribute('href') || '';
      const itemRoute = itemHref.replace(/^#/, '');
      if (itemRoute === route || (route === '/' && itemRoute === '')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  refresh() {
    this.handleRoute();
  }
}
