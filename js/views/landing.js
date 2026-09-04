// MARIX Marine Bridge Console — Landing / Stakeholder Command View (/# or /#/)
// Atmospheric Bridge Introduction, Dynamic Stakeholder Role Banner,
// Personalized Quick Actions, AI Recommendations, and Analog Radar

import { authService } from '../services/authService.js';

export function renderLandingView(container, { i18n, soundEngine }) {
  const user = authService.getCurrentUser();

  // Generate KPI Ribbon items for active stakeholder
  const kpiItemsHtml = user.kpis.map(kpi => `
    <div class="stat-item">
      <span class="stat-label">${kpi.label}</span>
      <span class="stat-val ${kpi.highlight}">${kpi.value}</span>
    </div>
  `).join('');

  // Generate Stakeholder Quick Actions
  const quickActionsHtml = user.quickActions.map(action => `
    <a href="${action.route}" class="quick-action-card" id="quick-act-${action.id}">
      <span class="quick-action-icon">${action.icon}</span>
      <span class="quick-action-text">${action.label}</span>
    </a>
  `).join('');

  container.innerHTML = `
    <div class="landing-view">
      <!-- Active Stakeholder Operational Welcome Ribbon -->
      <div class="stakeholder-hero-banner bezel-panel">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="role-icon-wrapper" style="border-color: ${user.color}; width: 44px; height: 44px; font-size: 1.5rem;">
            ${user.icon}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h2 class="font-display" style="font-size: 1.15rem; font-weight: 700; color: var(--parchment-bright); margin: 0;">
                ${user.name}
              </h2>
              <span class="stakeholder-badge-pill" style="border-color: ${user.color}; color: ${user.color};">
                ${user.roleTitle}
              </span>
              <span class="font-data text-muted" style="font-size: 0.65rem;">
                ${user.badge}
              </span>
            </div>
            <div class="font-data text-muted" style="font-size: 0.72rem; margin-top: 2px;">
              STATION: <span class="text-brass">${user.station}</span> • VESSEL/SECTOR: <span class="text-parchment">${user.vessel}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <a href="#/login" class="btn-tactical btn-tactical-sm" style="padding: 6px 12px; font-size: 0.72rem;">
            <span>👥</span> SWITCH DEMO ROLE
          </a>
        </div>
      </div>

      <!-- Main Hero Grid -->
      <div class="landing-hero-grid">
        <!-- Left Hero Content -->
        <div class="hero-left">
          <div class="hero-wordmark-plate">
            <span class="beacon-pulse"></span>
            <span class="font-data text-brass" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;">
              MARIX / ORCA REASONING BRIDGE v2.4
            </span>
          </div>

          <h1 class="hero-title">
            The Bridge Console for <em>Autonomous Marine Intelligence</em>.
          </h1>

          <p class="hero-prose" style="color: var(--parchment); line-height: 1.5;">
            ${user.greeting}
          </p>

          <div class="hero-actions">
            <a href="#/chat" id="btn-enter-console" class="btn-tactical btn-tactical-amber" style="padding: 12px 24px; font-size: 0.88rem;">
              <span>⚡</span> ${i18n.enter_console}
            </a>
            <a href="#/map" class="btn-tactical" style="padding: 12px 20px;">
              <span>🗺️</span> ${i18n.view_live_map}
            </a>
            <a href="#/safety" class="btn-tactical" style="padding: 12px 20px;">
              <span>🛡️</span> SAFETY ALERTS
            </a>
          </div>

          <!-- Stakeholder Customized KPI Ribbon -->
          <div class="hero-stat-ribbon">
            ${kpiItemsHtml}
          </div>
        </div>

        <!-- Right Visual: Analog Radar Sweep Display -->
        <div class="hero-right" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div class="radar-display-bezel">
            <div class="radar-grid-rings"></div>
            <div class="radar-crosshairs"></div>
            <div class="radar-sweep-wedge"></div>
            
            <!-- Simulated Radar Target Blips -->
            <div class="radar-blip" style="top: 32%; left: 65%;" title="PFZ Alpha Thermal Front"></div>
            <div class="radar-blip" style="top: 70%; left: 40%; background: var(--radar-red); box-shadow: 0 0 8px var(--radar-red);" title="Cyclone Depression Varuna"></div>
            <div class="radar-blip" style="top: 48%; left: 52%; background: var(--phosphor-amber); box-shadow: 0 0 8px var(--phosphor-amber);" title="Vessel INS Sagar Vikram"></div>
            <div class="radar-blip" style="top: 25%; left: 30%;" title="Fishing Fleet Alpha"></div>

            <div style="position: absolute; bottom: 12px; font-family: var(--font-data); font-size: 0.65rem; color: var(--brass); letter-spacing: 0.08em;">
              RADAR RANGE: 120 NM
            </div>
          </div>

          <div class="font-data text-muted" style="font-size: 0.72rem; margin-top: 14px; text-align: center;">
            STATION ID: <span class="text-brass">${user.station}</span> • JURISDICTION: <span class="text-green">${user.domain}</span>
          </div>
        </div>
      </div>

      <!-- Stakeholder AI Recommendation & Directive Card -->
      <div class="bezel-panel panel-body" style="background: rgba(18, 27, 34, 0.75); border-left: 3px solid ${user.color}; margin-top: 18px;">
        <div class="panel-header" style="background: transparent; padding: 0 0 8px 0; border-bottom: 1px solid var(--chart-line); margin-bottom: 8px;">
          <span class="panel-title">
            <span class="icon">🤖</span> AI ADAPTIVE REASONING DIRECTIVE — ${user.roleTitle.toUpperCase()}
          </span>
          <span class="panel-badge badge-green">LIVE SYNTHESIS</span>
        </div>
        <div style="font-size: 0.84rem; color: var(--parchment-bright); line-height: 1.5;">
          ${user.aiRecommendation}
        </div>
      </div>

      <!-- Stakeholder Quick Actions Bar -->
      <div style="margin-top: 20px;">
        <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px;">
          ▶ OPERATIONAL QUICK ACTIONS FOR ${user.roleTitle.toUpperCase()}
        </div>
        <div class="quick-actions-ribbon">
          ${quickActionsHtml}
        </div>
      </div>

      <!-- Operational Architecture Highlights -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 20px;">
        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-amber" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            01 // MULTIMODAL REASONING
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Natural language vessel guidance streaming real-time analog risk dials, PFZ thermal coordinates, and weather cards.
          </div>
        </div>

        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-green" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            02 // SATELLITE & SENSOR FUSION
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Direct integration with INCOIS, NOAA SST Geo-Polar, Sentinel-3 Chlorophyll, and IMD Coastal Doppler radars.
          </div>
        </div>

        <div class="bezel-panel panel-body" style="background: rgba(18,27,34,0.6);">
          <div class="font-data text-brass" style="font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            03 // PARETO ROUTE OPTIMIZATION
          </div>
          <div style="font-size: 0.84rem; color: var(--parchment);">
            Evaluates bathymetry and rogue swell fields to generate fuel-optimal routes that avoid cyclone danger cores.
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach interactive sounds
  const enterBtn = container.querySelector('#btn-enter-console');
  if (enterBtn && soundEngine) {
    enterBtn.addEventListener('click', () => {
      soundEngine.playTacticalChirp();
    });
  }

  container.querySelectorAll('.quick-action-card').forEach(card => {
    card.addEventListener('click', () => {
      if (soundEngine) soundEngine.playMechanicalClick();
    });
  });
}
