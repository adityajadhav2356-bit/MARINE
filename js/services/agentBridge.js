// MARIX Agent Bridge Service
// Coordinates multimodal reasoning with AI Agents (Mock SSE Streamer + Live API Adapter)
// Enhanced with specialized reasoning pipelines for all 6 stakeholder roles.

import { PFZ_ZONES, MONITORED_ZONES, ACTIVE_ALERTS, ROUTE_PRESETS, MOCK_VESSELS } from '../data/mockData.js';
import { 
  createRiskCard, 
  createPFZCard, 
  createWeatherCard, 
  createVesselAdvisoryCard, 
  createRoutePreviewCard, 
  createReasoningLogCard 
} from '../components/cards.js';

export class AgentBridgeService {
  constructor() {
    this.mode = localStorage.getItem('orca_agent_mode') || 'SIMULATED'; // 'SIMULATED' or 'LIVE_API'
    this.endpointUrl = localStorage.getItem('orca_agent_endpoint') || 'http://localhost:8000/api/orca/reason';
    this.apiKey = localStorage.getItem('orca_agent_key') || '';
  }

  setMode(mode) {
    this.mode = mode;
    localStorage.setItem('orca_agent_mode', mode);
  }

  setEndpoint(url, key = '') {
    this.endpointUrl = url;
    this.apiKey = key;
    localStorage.setItem('orca_agent_endpoint', url);
    localStorage.setItem('orca_agent_key', key);
  }

  // Stream generator that yields reasoning chunks and UI component cards
  async *streamQuery(promptText, onChunk) {
    if (this.mode === 'LIVE_API') {
      try {
        const response = await fetch(this.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {})
          },
          body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
          throw new Error(`Agent API returned status ${response.status}`);
        }

        const data = await response.json();
        yield data;
        return;
      } catch (err) {
        console.warn('Live API connection failed, falling back to simulated bridge:', err);
      }
    }

    // Simulated Reasoning Engine matching the prompt intent
    const intent = this.detectIntent(promptText);
    const mockPlan = this.generatePlanForIntent(intent, promptText);

    // 1. Stream Chain of Thought step by step
    for (let i = 0; i < mockPlan.steps.length; i++) {
      await this.delay(320);
      if (onChunk) {
        onChunk({ type: 'STEP', step: mockPlan.steps[i], stepIndex: i });
      }
    }

    // 2. Stream Agent Prose Text
    const words = mockPlan.prose.split(' ');
    let currentProse = '';
    for (let word of words) {
      currentProse += word + ' ';
      await this.delay(35);
      if (onChunk) {
        onChunk({ type: 'PROSE_DELTA', text: currentProse });
      }
    }

    // 3. Emit rendered component cards
    await this.delay(180);
    yield {
      type: 'COMPLETE',
      prose: mockPlan.prose,
      steps: mockPlan.steps,
      cardsHtml: mockPlan.cardsHtml
    };
  }

  detectIntent(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('fleet') || p.includes('enforce') || p.includes('permit') || p.includes('trawler') || p.includes('quota') || p.includes('unauthorized') || p.includes('recall')) {
      return 'FLEET_ENFORCEMENT';
    } else if (p.includes('aquaculture') || p.includes('oxygen') || p.includes('salinity') || p.includes('hab') || p.includes('algal') || p.includes('cage') || p.includes('feed')) {
      return 'AQUACULTURE_WATER';
    } else if (p.includes('vts') || p.includes('anchorage') || p.includes('fairway') || p.includes('ukc') || p.includes('draught') || p.includes('draft') || p.includes('shoal') || p.includes('harbour master')) {
      return 'PORT_VTS';
    } else if (p.includes('cyclone') || p.includes('storm') || p.includes('surge') || p.includes('evacuat') || p.includes('disaster') || p.includes('inundation') || p.includes('varuna')) {
      return 'STORM_RISK';
    } else if (p.includes('fish') || p.includes('pfz') || p.includes('catch') || p.includes('konkan') || p.includes('yield') || p.includes('mackerel') || p.includes('trawl')) {
      return 'PFZ_SEARCH';
    } else if (p.includes('route') || p.includes('veraval') || p.includes('ratnagiri') || p.includes('waypoint') || p.includes('fuel-saving')) {
      return 'ROUTE_OPTIMIZE';
    } else if (p.includes('sst') || p.includes('chlorophyll') || p.includes('upwelling') || p.includes('temperature') || p.includes('research') || p.includes('ekman') || p.includes('thermocline')) {
      return 'RESEARCH_SST';
    }
    return 'GENERAL_MARITIME';
  }

  generatePlanForIntent(intent, originalPrompt) {
    switch (intent) {
      case 'FLEET_ENFORCEMENT': {
        return {
          steps: [
            "Querying AIS transponder registry & coastal radar tracking network...",
            "Matching active vessels against National Maritime Quota database...",
            "Correlating 118 vessel positions with Cyclone Varuna hazard perimeter...",
            "Generating fleet compliance directives and broadcast recall payload..."
          ],
          prose: `Surveillance Mesh Synthesis for **${originalPrompt}**: 118 licensed fishing vessels are actively tracked in Sector 4B. 12 artisanal and commercial trawlers are currently operating within 35 nm of Deep Depression Varuna's gale perimeter. Immediate VHF DSC recall on Channel 16 is mandated. Quota harvest compliance across the monitored fleet stands at 98.2% nominal.`,
          cardsHtml: [
            createVesselAdvisoryCard({
              priority: "CRITICAL",
              heading: "Fleet Recall Advisory — Sector 2A / 4B",
              text: "12 vessels inside hazardous swell radius. Order immediate retreat to Ratnagiri and Mumbai safe inner roadsteads.",
              safeHarbor: "Ratnagiri & JNPT Anchorages",
              vhf: "VHF CH 16 / DSC 2187.5 kHz"
            }),
            createRiskCard({
              riskScore: 78,
              status: "FLEET AT RISK",
              zoneName: "ARABIAN SEA NORTH",
              title: "12 Vessels In Outer Storm Cone",
              description: "Breaking swells of 4.8m. Gale force winds 45-55 kts.",
              coordinates: "20°48'N, 68°30'E",
              swell: "4.8m",
              wind: "52 kts"
            })
          ].join('')
        };
      }

      case 'AQUACULTURE_WATER': {
        return {
          steps: [
            "Ingesting coastal sensor buoy telemetry (DO, Salinity, Temperature)...",
            "Screening Copernicus Sentinel-3 OLCI spectral bands for HAB / dinoflagellate pigments...",
            "Computing wave stress on offshore sea-cage mooring anchor arrays...",
            "Generating dissolved oxygen trajectory and supplementary aeration schedule..."
          ],
          prose: `Mariculture Diagnostic for **${originalPrompt}**: Water parameters across the Devgad & Ratnagiri sea-cage clusters are favorable. Dissolved Oxygen is optimal at 6.8 mg/L with water temperature steady at 27.4°C. Sentinel-3 multispectral imagery shows HAB (Harmful Algal Bloom) risk is NEGATIVE. Wave stress on cage moorings under current 1.2m swell is within structural safety limits (<38% tension load).`,
          cardsHtml: [
            createWeatherCard({
              pressure: "1011.8 hPa",
              sst: "27.4°C (Optimal)",
              wind: "11 kts NW",
              swell: "1.1m (Calm Inside Lee)",
              visibility: "10.0 nm"
            }),
            createReasoningLogCard([
              "Dissolved Oxygen (DO): 6.8 mg/L (Safe Threshold > 5.0 mg/L)",
              "Salinity: 34.2 ppt • pH: 8.15 • Turbidity: 1.4 NTU",
              "Harmful Algal Bloom (HAB) Index: 0.04 (Negative / Clear)",
              "Mooring Line Tension: 38% nominal load limit",
              "Recommendation: Schedule optional aeration from 0200Z to 0600Z during neap low tide."
            ])
          ].join('')
        };
      }

      case 'PORT_VTS': {
        return {
          steps: [
            "Querying Mumbai Port VTS Radar & AIS Fairway Transponders...",
            "Calculating Under-Keel Clearance (UKC) across outer channel bathymetry...",
            "Evaluating anchorage queue density and fog visibility degradation...",
            "Generating pilotage and draught restriction protocol..."
          ],
          prose: `VTS Operational Assessment for **${originalPrompt}**: 48 cargo and tanker vessels are currently staged at Mumbai Outer Anchorage. Dense morning radiation fog has reduced fairway visibility to 1.2 nm. Under-Keel Clearance (UKC) for inbound VLCCs is restricted to 3.2m during current low water. Mandatory 0.5 nm radar guard separation and VHF Channel 12/16 watch is in effect.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 62,
              status: "CONGESTION ADVISORY",
              zoneName: "MUMBAI OUTER FAIRWAY",
              title: "48 Vessels Staged at Outer Roads",
              description: "Reduced visibility (<1.2 nm). Draught restrictions on Berths 4-7.",
              coordinates: "18°54'N, 72°45'E",
              swell: "1.8m",
              wind: "14 kts"
            }),
            createWeatherCard({
              pressure: "1009.2 hPa",
              sst: "28.1°C",
              wind: "14 kts SW",
              swell: "1.8m Moderate",
              visibility: "1.2 nm (Dense Fog)"
            })
          ].join('')
        };
      }

      case 'STORM_RISK': {
        return {
          steps: [
            "Querying Doppler Weather Radar feed & INCOIS Ocean Wave buoy network...",
            "Computing barometric gradient, storm surge vectors, and breaking swell heights...",
            "Evaluating civil defense evacuation staging for Saurashtra & Konkan ports..."
          ],
          prose: `Disaster Command Synthesis for **${originalPrompt}**: Deep Depression Varuna is intensifying with central pressure plunging to **988 hPa** and tracking NE at 14 knots. Phenomenal wave heights (5.8m) with gale winds reaching 55 kts (gusts 65 kts) will impact Saurashtra coastline within 18 hours. Port Danger Signal No. 8 hoisted at Okha and Porbandar. Coastal inundation simulation indicates a 1.4m surge above astronomical high tide.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 88,
              status: "CRITICAL CYCLONE CORE",
              zoneName: "NORTH ARABIAN SEA",
              title: "Deep Depression Varuna (Hazard Index 88/100)",
              description: "Severe gale escalation with 5.8m breaking swells. Port Danger Signal 8.",
              coordinates: "20°48'N, 68°30'E",
              swell: "4.8m - 5.8m Phenomenal",
              wind: "55 kts (Gale Force)"
            }),
            createWeatherCard({
              pressure: "988.4 hPa (Rapid Fall)",
              sst: "29.4°C (+1.8° Anomaly)",
              wind: "55 kts WNW",
              swell: "5.8m @ 15.2s",
              visibility: "0.8 nm (Violent Squalls)"
            }),
            createVesselAdvisoryCard({
              priority: "CRITICAL",
              heading: "Emergency Harbor Evacuation Order",
              text: "Suspend all port operations. Plot course 120° towards Ratnagiri or Mumbai inner roads. Continuous watch on VHF CH 16.",
              safeHarbor: "Ratnagiri Anchorage / JNPT",
              vhf: "VHF CH 16 / DSC MF 2187.5 kHz"
            })
          ].join('')
        };
      }

      case 'PFZ_SEARCH': {
        const pfz = PFZ_ZONES[0]; // Konkan Thermal Front
        return {
          steps: [
            "Filtering Copernicus Sentinel-3 OLCI multispectral chlorophyll imagery...",
            "Correlating thermal fronts with sea surface temperature gradient...",
            "Generating fish biomass concentration and species yield probabilities..."
          ],
          prose: `High-yield Potential Fishing Zone (PFZ) isolated along the **Konkan Shelf (Thermal Front Alpha)**. A strong upwelling front with negative SST anomaly (-1.4°C) is generating peak chlorophyll-a concentrations of 3.4 mg/m³. Pelagic fish schools (Indian Mackerel, Sardinella, and Yellowfin Tuna) are heavily concentrated along the 65-meter isobath. Projected fuel savings are 28% compared to unguided trawling.`,
          cardsHtml: [
            createPFZCard(pfz),
            createWeatherCard({
              pressure: "1011.2 hPa",
              sst: "26.8°C (Upwelling Front)",
              wind: "12 kts NW (Favorable)",
              swell: "1.2m Slight",
              visibility: "8.0 nm (Clear)"
            }),
            createRiskCard({
              riskScore: 21,
              status: "SAFE FOR FISHING",
              zoneName: "KONKAN SHELF",
              title: "Konkan Alpha Fishing Perimeter",
              description: "Calm sea state with slight swell. Excellent operational conditions for purse seiners and trawlers.",
              coordinates: "17°25'N, 72°21'E",
              swell: "1.2m",
              wind: "12 kts"
            })
          ].join('')
        };
      }

      case 'ROUTE_OPTIMIZE': {
        const route = ROUTE_PRESETS[0];
        return {
          steps: [
            "Extracting bathymetric contours & restricted naval exercise sectors...",
            "Simulating multi-objective Pareto front (Minimum Risk vs Fuel vs Time)...",
            "Plotting safe waypoint corridor around gale perimeter..."
          ],
          prose: `Route optimization complete between **${route.origin.name}** and **${route.destination.name}**. The direct shortest course directly crosses a gale-force storm cell with 5.5m rogue swells and an unacceptable risk score of **84/100**. ORCA has generated a safe coastal waypoint diversion that reduces risk to **19/100** while saving approximately 530 Liters of fuel by exploiting coastal lee currents.`,
          cardsHtml: [
            createRoutePreviewCard({
              origin: "Veraval Port",
              destination: "Ratnagiri Port"
            }),
            createRiskCard({
              riskScore: 19,
              status: "SAFE PASSAGE",
              zoneName: "COASTAL CORRIDOR",
              title: "ORCA Recommended Safe Route",
              description: "Leverages bathymetric lee shelter. Skirts fishing zone Alpha for opportunistic catch.",
              coordinates: "Via Waypoints 20.6°N, 71.4°E → 18.4°N, 72.8°E",
              swell: "1.8m Moderate",
              wind: "16 kts"
            })
          ].join('')
        };
      }

      case 'RESEARCH_SST': {
        return {
          steps: [
            "Querying NOAA Geo-Polar 5km Blended SST archive...",
            "Computing 30-day thermal anomaly moving averages...",
            "Evaluating thermocline displacement and chlorophyll-a coupling..."
          ],
          prose: `Oceanographic analysis indicates an intensified coastal upwelling cycle along the West Coast of India. The thermal anomaly has shifted to -1.5°C over the past 10 days, displacing the thermocline to 18m below surface level. This has triggered a 300% increase in primary biomass synthesis, making this the most productive biological window of the current monsoon transition.`,
          cardsHtml: [
            createReasoningLogCard([
              "NOAA Geo-Polar SST: 26.5°C recorded at Buoy CB-02 (-1.8°C deviation from 10yr baseline)",
              "Sentinel-3 OLCI: Chlorophyll-a index peaked at 4.2 mg/m³",
              "Biomass Yield Model: Positive correlation with Pelagic catch volume (R² = 0.92)",
              "Recommendation: Deploy acoustic fish finders along 50m bathymetric contour"
            ]),
            createPFZCard(PFZ_ZONES[1])
          ].join('')
        };
      }

      default: {
        return {
          steps: [
            "Parsing maritime operational command...",
            "Querying real-time coastal telemetry and AIS vessel positions...",
            "Synthesizing navigational advisory..."
          ],
          prose: `MARIX Autonomous Marine Intelligence Bridge is actively monitoring maritime space. All sensor adapters (INCOIS, NOAA, Sentinel-3, IMD Radar, and AIS) are synchronized with sub-second latency. No anomalous distress transmissions detected in your immediate quadrant.`,
          cardsHtml: [
            createRiskCard({
              riskScore: 28,
              status: "SYSTEM READY",
              zoneName: "LOCAL QUADRANT",
              title: "Operational Status Nominal",
              description: "All automated vessel monitoring sensors reporting nominal telemetry.",
              coordinates: "18°58'N, 72°49'E",
              swell: "1.6m",
              wind: "15 kts"
            })
          ].join('')
        };
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
