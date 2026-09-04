// MARIX Marine Bridge Console — Interactive Marine Map (/#map)
// Leaflet.js ocean cartography with multi-provider demo basemaps (Zero API key required)
// Features Esri World Ocean bathymetry, CartoDB Dark Tactical, Satellite, and OSM layers.

import { PFZ_ZONES, HAZARD_ZONES, MOCK_VESSELS } from '../data/mockData.js';
import { initMapViewWithBackend } from '../map.js';
import { authService } from '../services/authService.js';

export const BASEMAP_PROVIDERS = {
  ocean: {
    name: "🌊 Esri World Ocean (Bathymetric)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    options: { maxZoom: 13, attribution: "Esri, GEBCO, NOAA, National Geographic" }
  },
  dark: {
    name: "🌑 Dark Tactical Console (CARTO)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    options: { maxZoom: 18, subdomains: "abcd", attribution: "&copy; OpenStreetMap, &copy; CARTO" }
  },
  satellite: {
    name: "🛰️ Satellite Multispectral (Esri)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: { maxZoom: 18, attribution: "Esri, Maxar, Earthstar Geographics" }
  },
  osm: {
    name: "🗺️ OpenStreetMap Marine Standard",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }
  }
};

export function renderMapView(container, { i18n, soundEngine }) {
  const user = authService.getCurrentUser();
  const layers = user.mapLayers || { pfz: true, hazards: true, vessels: true, bathymetry: true };
  const focus = user.mapFocus || { coords: [18.5, 72.2], zoom: 7 };
  let currentTileLayer = null;

  container.innerHTML = `
    <div class="map-view-container">
      <!-- Main Ocean Map Canvas -->
      <div id="leaflet-map"></div>

      <!-- Real-time Crosshair Coordinates Badge -->
      <div class="map-crosshair-badge" id="map-coords-badge">
        LAT: <span id="map-lat">18.9800° N</span> • LON: <span id="map-lon">72.8200° E</span> • DEPTH: <span id="map-depth">42m</span>
      </div>

      <!-- Right Physical Controls & Layer Switch Panel -->
      <div class="map-controls-panel">
        <div class="panel-header" style="padding: 4px 0; border: none; background: transparent;">
          <span class="panel-title">
            <span class="icon">🧭</span> NAUTICAL OVERLAYS
          </span>
          <span class="panel-badge badge-green">NO API KEY REQ</span>
        </div>

        <div style="font-family: var(--font-data); font-size: 0.70rem; color: var(--muted); border-bottom: 1px solid var(--chart-line); padding-bottom: 8px;">
          STATION: <strong class="text-brass">${user.station}</strong> • DATUM WGS-84
        </div>

        <!-- Basemap Provider Selector (Zero API Key Needed) -->
        <div class="route-form-group" style="margin-top: 6px;">
          <label class="font-data text-brass" style="font-size: 0.68rem; font-weight: 700;">
            🗺️ NAUTICAL BASEMAP (DEMO READY)
          </label>
          <select class="route-select" id="map-basemap-select" style="font-size: 0.72rem; padding: 6px 8px;">
            <option value="ocean" selected>🌊 Esri World Ocean (Bathymetric)</option>
            <option value="dark">🌑 Dark Tactical Console (CARTO)</option>
            <option value="satellite">🛰️ Satellite Multispectral (Esri)</option>
            <option value="osm">🗺️ OpenStreetMap Standard</option>
          </select>
        </div>

        <!-- Physical Brass Layer Toggles -->
        <div class="map-layer-toggles">
          <label class="physical-toggle-label">
            <input type="checkbox" class="physical-toggle-input" id="layer-pfz" ${layers.pfz ? 'checked' : ''}>
            <div class="physical-toggle"><div class="physical-toggle-lever"></div></div>
            <span>🐟 PFZ Thermal Fronts</span>
          </label>

          <label class="physical-toggle-label">
            <input type="checkbox" class="physical-toggle-input" id="layer-hazards" ${layers.hazards ? 'checked' : ''}>
            <div class="physical-toggle"><div class="physical-toggle-lever"></div></div>
            <span class="text-red">⚠️ Storm &amp; Hazard Zones</span>
          </label>

          <label class="physical-toggle-label">
            <input type="checkbox" class="physical-toggle-input" id="layer-vessels" ${layers.vessels ? 'checked' : ''}>
            <div class="physical-toggle"><div class="physical-toggle-lever"></div></div>
            <span class="text-amber">🚢 AIS Vessel Radar</span>
          </label>

          <label class="physical-toggle-label">
            <input type="checkbox" class="physical-toggle-input" id="layer-bathymetry" ${layers.bathymetry ? 'checked' : ''}>
            <div class="physical-toggle"><div class="physical-toggle-lever"></div></div>
            <span>🌊 50m / 100m Isobaths</span>
          </label>
        </div>

        <div style="border-top: 1px solid var(--chart-line); padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div class="panel-title" style="font-size: 0.72rem;">
            <span class="icon">🎯</span> SECTOR QUICK FOCUS
          </div>
          <button class="btn-tactical btn-tactical-sm text-left" id="btn-focus-mumbai">
            📍 Mumbai High Corridor
          </button>
          <button class="btn-tactical btn-tactical-sm text-left" id="btn-focus-konkan">
            📍 Konkan PFZ Alpha
          </button>
          <button class="btn-tactical btn-tactical-sm text-left" id="btn-focus-cyclone">
            📍 Cyclone Varuna Eye
          </button>
          <button class="btn-tactical btn-tactical-sm text-left text-amber" id="btn-focus-station">
            🎯 Station Focus: ${user.shortName}
          </button>
        </div>

        <!-- Selected Entity Readout Card -->
        <div class="bezel-panel panel-body" id="map-inspector-panel" style="margin-top: auto; background: #0A1116;">
          <div class="font-data text-muted" style="font-size: 0.65rem; text-transform: uppercase;">
            INSPECTOR READOUT
          </div>
          <div class="font-data text-amber" id="inspector-name" style="font-size: 0.82rem; font-weight: 700; margin: 4px 0;">
            Click map target to inspect
          </div>
          <div style="font-size: 0.75rem; color: var(--parchment);" id="inspector-desc">
            Select any PFZ marker, storm perimeter, or vessel icon to view live telemetry.
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize Leaflet Map
  const mapEl = container.querySelector('#leaflet-map');
  if (!mapEl || typeof L === 'undefined') return;

  const map = L.map(mapEl, {
    center: focus.coords,
    zoom: focus.zoom,
    zoomControl: false,
    attributionControl: false
  });

  L.control.zoom({ position: 'topleft' }).addTo(map);

  // Set initial basemap
  function setBasemap(providerKey) {
    const provider = BASEMAP_PROVIDERS[providerKey] || BASEMAP_PROVIDERS.ocean;
    if (currentTileLayer) {
      map.removeLayer(currentTileLayer);
    }

    currentTileLayer = L.tileLayer(provider.url, {
      ...provider.options,
      // Error recovery fallback: if tiles fail to load, fallback to Esri Ocean
      errorTileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/0/0/0'
    }).addTo(map);

    currentTileLayer.on('tileerror', () => {
      console.warn('[Map] Tile error on', providerKey, '- fallback ready');
    });
  }

  setBasemap('ocean');

  // Basemap Selector Change Handler
  const basemapSelect = container.querySelector('#map-basemap-select');
  if (basemapSelect) {
    basemapSelect.addEventListener('change', (e) => {
      if (soundEngine) soundEngine.playMechanicalClick();
      setBasemap(e.target.value);
    });
  }

  // Layer Groups
  const pfzLayerGroup = L.layerGroup();
  const hazardLayerGroup = L.layerGroup();
  const vesselLayerGroup = L.layerGroup();
  const bathyLayerGroup = L.layerGroup();

  if (layers.pfz) pfzLayerGroup.addTo(map);
  if (layers.hazards) hazardLayerGroup.addTo(map);
  if (layers.vessels) vesselLayerGroup.addTo(map);
  if (layers.bathymetry) bathyLayerGroup.addTo(map);

  // 1. Populate PFZ Zones
  PFZ_ZONES.forEach(pfz => {
    const pfzIcon = L.divIcon({
      className: 'custom-pfz-marker',
      html: `
        <div style="
          width: 28px; height: 28px; 
          background: rgba(18, 27, 34, 0.9); 
          border: 2px solid var(--phosphor-green); 
          border-radius: 50%; 
          display: flex; align-items: center; justify-content: center;
          color: var(--phosphor-green);
          font-size: 13px;
          box-shadow: 0 0 10px rgba(107, 203, 119, 0.4);
          cursor: pointer;
        ">🐟</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker(pfz.coordinates, { icon: pfzIcon }).addTo(pfzLayerGroup);

    marker.bindPopup(`
      <div class="map-instrument-popup">
        <div class="map-popup-header">${pfz.name}</div>
        <div class="map-popup-row"><span class="text-muted">LAT/LON:</span> <span class="text-amber">${pfz.latLonStr}</span></div>
        <div class="map-popup-row"><span class="text-muted">SST ANOMALY:</span> <span class="text-green">${pfz.sstAnomaly}</span></div>
        <div class="map-popup-row"><span class="text-muted">CHLOROPHYLL:</span> <span class="text-amber">${pfz.chlorophyll}</span></div>
        <div class="map-popup-row"><span class="text-muted">BIOMASS CONFIDENCE:</span> <span class="text-green">${pfz.confidence}</span></div>
        <div class="map-popup-row"><span class="text-muted">DISTANCE / DEPTH:</span> <span>${pfz.distanceNm} nm / ${pfz.depthM}m</span></div>
        <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid var(--chart-line); font-size: 0.68rem; color: var(--parchment);">
          ${pfz.advisory}
        </div>
      </div>
    `);

    marker.on('click', () => {
      if (soundEngine) soundEngine.playTacticalBeep();
      updateInspector(pfz.name, `${pfz.advisory} SST Anomaly: ${pfz.sstAnomaly}. Target Species: ${pfz.targetSpecies.join(', ')}.`);
    });
  });

  // 2. Populate Hazard Zones (Circles & Polygons)
  HAZARD_ZONES.forEach(hz => {
    const circle = L.circle(hz.center, {
      color: hz.color,
      fillColor: hz.color,
      fillOpacity: 0.18,
      radius: hz.radiusKm,
      weight: 2,
      dashArray: '4, 6'
    }).addTo(hazardLayerGroup);

    circle.bindPopup(`
      <div class="map-instrument-popup" style="border-top: 3px solid ${hz.color};">
        <div class="map-popup-header" style="color: ${hz.color};">⚠️ ${hz.name}</div>
        <div class="map-popup-row"><span class="text-muted">SEVERITY:</span> <span style="color: ${hz.color};">${hz.severity}</span></div>
        <div class="map-popup-row"><span class="text-muted">MAX WIND:</span> <span class="text-amber">${hz.windMax}</span></div>
        <div class="map-popup-row"><span class="text-muted">MAX SWELL:</span> <span class="text-red">${hz.waveHeightMax}</span></div>
        <div class="map-popup-row"><span class="text-muted">PRESSURE:</span> <span>${hz.pressure}</span></div>
        <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid var(--chart-line); font-size: 0.68rem; color: var(--parchment);">
          ${hz.advisory}
        </div>
      </div>
    `);

    circle.on('click', () => {
      if (soundEngine) soundEngine.playTacticalBeep();
      updateInspector(hz.name, `HAZARD WARNING: ${hz.advisory} (Wind: ${hz.windMax}, Waves: ${hz.waveHeightMax})`);
    });
  });

  // 3. Populate AIS Vessels
  MOCK_VESSELS.forEach(ves => {
    const vesIcon = L.divIcon({
      className: 'custom-vessel-marker',
      html: `
        <div style="
          width: 24px; height: 24px; 
          background: rgba(18, 27, 34, 0.95); 
          border: 1.5px solid var(--phosphor-amber); 
          border-radius: 3px; 
          display: flex; align-items: center; justify-content: center;
          color: var(--phosphor-amber);
          font-size: 11px;
          box-shadow: 0 0 8px rgba(255, 180, 84, 0.4);
          cursor: pointer;
        ">▲</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(ves.coordinates, { icon: vesIcon }).addTo(vesselLayerGroup);

    marker.bindPopup(`
      <div class="map-instrument-popup">
        <div class="map-popup-header">🚢 ${ves.name}</div>
        <div class="map-popup-row"><span class="text-muted">TYPE:</span> <span>${ves.type}</span></div>
        <div class="map-popup-row"><span class="text-muted">STATUS:</span> <span class="text-green">${ves.status}</span></div>
        <div class="map-popup-row"><span class="text-muted">SPEED/COURSE:</span> <span class="text-amber">${ves.speed} @ ${ves.course}</span></div>
        <div class="map-popup-row"><span class="text-muted">DRAFT:</span> <span>${ves.draft}</span></div>
      </div>
    `);

    marker.on('click', () => {
      if (soundEngine) soundEngine.playTacticalBeep();
      updateInspector(ves.name, `Vessel Tracking: ${ves.type}. Speed: ${ves.speed}, Heading: ${ves.course}, Status: ${ves.status}.`);
    });
  });

  // 4. Bathymetry Contour Lines
  const bathy50m = L.polyline([
    [21.8, 69.2], [20.5, 70.8], [19.2, 72.1], [18.0, 72.7], [16.5, 73.1], [15.0, 73.5], [10.0, 75.4]
  ], {
    color: '#34495E',
    weight: 1.8,
    dashArray: '3, 4'
  }).addTo(bathyLayerGroup);

  // Mouse Move Coordinates Tracking
  map.on('mousemove', (e) => {
    const latSpan = container.querySelector('#map-lat');
    const lonSpan = container.querySelector('#map-lon');
    const depthSpan = container.querySelector('#map-depth');

    if (latSpan && lonSpan) {
      latSpan.textContent = `${Math.abs(e.latlng.lat).toFixed(4)}° ${e.latlng.lat >= 0 ? 'N' : 'S'}`;
      lonSpan.textContent = `${Math.abs(e.latlng.lng).toFixed(4)}° ${e.latlng.lng >= 0 ? 'E' : 'W'}`;
      const approxDepth = Math.max(12, Math.min(2400, Math.round((73.5 - e.latlng.lng) * 180 + 35)));
      if (depthSpan) depthSpan.textContent = `${approxDepth}m`;
    }
  });

  // Layer Toggle Handlers
  const chkPFZ = container.querySelector('#layer-pfz');
  const chkHazards = container.querySelector('#layer-hazards');
  const chkVessels = container.querySelector('#layer-vessels');
  const chkBathy = container.querySelector('#layer-bathymetry');

  chkPFZ.addEventListener('change', () => {
    if (soundEngine) soundEngine.playMechanicalClick();
    chkPFZ.checked ? map.addLayer(pfzLayerGroup) : map.removeLayer(pfzLayerGroup);
  });

  chkHazards.addEventListener('change', () => {
    if (soundEngine) soundEngine.playMechanicalClick();
    chkHazards.checked ? map.addLayer(hazardLayerGroup) : map.removeLayer(hazardLayerGroup);
  });

  chkVessels.addEventListener('change', () => {
    if (soundEngine) soundEngine.playMechanicalClick();
    chkVessels.checked ? map.addLayer(vesselLayerGroup) : map.removeLayer(vesselLayerGroup);
  });

  chkBathy.addEventListener('change', () => {
    if (soundEngine) soundEngine.playMechanicalClick();
    chkBathy.checked ? map.addLayer(bathyLayerGroup) : map.removeLayer(bathyLayerGroup);
  });

  // Quick Focus Buttons
  container.querySelector('#btn-focus-mumbai').addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalBeep();
    map.flyTo([18.98, 72.82], 8);
  });

  container.querySelector('#btn-focus-konkan').addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalBeep();
    map.flyTo([17.42, 72.35], 9);
  });

  container.querySelector('#btn-focus-cyclone').addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalBeep();
    map.flyTo([20.80, 68.50], 7);
  });

  container.querySelector('#btn-focus-station').addEventListener('click', () => {
    if (soundEngine) soundEngine.playTacticalBeep();
    map.flyTo(focus.coords, focus.zoom);
  });

  function updateInspector(title, text) {
    const titleEl = container.querySelector('#inspector-name');
    const descEl = container.querySelector('#inspector-desc');
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = text;
  }

  // ── BACKEND LAYER OVERLAY ─────────────────────────────────────────────────
  initMapViewWithBackend(container, soundEngine).catch(function(e) {
    console.warn('[Map View] initMapViewWithBackend error:', e);
  });
}
