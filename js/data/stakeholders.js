// MARIX Maritime Bridge Console — Pre-configured Stakeholder Demo Accounts
// Defines 6 key marine stakeholder profiles, demo credentials, domain configurations,
// suggested queries, quick actions, map preferences, and AI recommendations.

export const STAKEHOLDERS = [
  {
    id: "fisherman",
    name: "Aditya Patil",
    shortName: "Aditya",
    roleTitle: "Fisherman",
    domain: "Artisanal & Pelagic Marine Fishery",
    email: "fisherman@marix.demo",
    password: "MARIX@123",
    icon: "🎣",
    badge: "● Demo Account",
    color: "var(--phosphor-green)",
    station: "PORT-VERAVAL-04",
    vessel: "MATSYA PRABHA IV (28m Trawler)",
    coordinates: "17°25'N, 72°21'E",
    kpis: [
      { label: "NEARBY PFZ FRONTS", value: "4 DETECTED", highlight: "text-green" },
      { label: "EST. FUEL SAVINGS", value: "28% OPTIMAL", highlight: "text-amber" },
      { label: "SEA STATE / SWELL", value: "1.2m MODERATE", highlight: "text-parchment" },
      { label: "CATCH YIELD INDEX", value: "94/100 (HIGH)", highlight: "text-green" }
    ],
    greeting: "Welcome back, Aditya. 4 high-yield thermal upwelling fronts are active along the Konkan shelf.",
    quickActions: [
      { id: "find-pfz", label: "Find Closest PFZ Zone", icon: "🐟", route: "#/map" },
      { id: "check-swells", label: "Check Sea Swell Safety", icon: "🌊", route: "#/safety" },
      { id: "fuel-route", label: "Fuel-Optimal Passage", icon: "⛽", route: "#/route" },
      { id: "sos-guard", label: "Coast Guard VHF Alert", icon: "🚨", route: "#/safety" }
    ],
    suggestedQuestions: [
      { query: "Find high-yield fishing zones with thermal fronts on Konkan coast", label: "🐟 High-Yield PFZ Discovery (Konkan Coast)" },
      { query: "Assess wave height, swell period, and storm risk near Mumbai", label: "🌪️ Wave & Swell Safety (Mumbai High)" },
      { query: "Safe route vs shortest route from Veraval to Ratnagiri to save fuel", label: "⛽ Fuel-Saving Trawl Passage (Veraval → Ratnagiri)" },
      { query: "Shallow shoals and depth hazards in Gulf of Khambhat for low draft", label: "⚓ Harbour Approach & Sandbank Warnings" }
    ],
    mapLayers: {
      pfz: true,
      hazards: true,
      vessels: false,
      bathymetry: true
    },
    mapFocus: { coords: [17.42, 72.35], zoom: 8 },
    aiRecommendation: "Konkan Thermal Front Alpha is peaking with a 96% biomass confidence index along the 65m contour. Pelagic schools (Mackerel & Sardinella) are concentrated. Optimal window: 0300Z to 1100Z. Estimated fuel reduction is 28% vs unguided trawling.",
    alertsPriority: ["THERMAL UPWELLING", "ROGUE WAVE HAZARD", "CYCLONE / GALE"],
    terminology: {
      intercomPrompt: "Transmit fishing query, coordinates, or sea condition check... (e.g. 'Best PFZ zone near Ratnagiri')",
      kpiTitle: "ARTISANAL & PELAGIC HARVEST TELEMETRY",
      directiveLabel: "FISHING ADVISORY & SAFETY PROTOCOL"
    }
  },
  {
    id: "officer",
    name: "Rajesh Shinde",
    shortName: "Rajesh",
    roleTitle: "Fisheries Officer",
    domain: "Fisheries Department & Fleet Enforcement",
    email: "officer@marix.demo",
    password: "MARIX@123",
    icon: "👮",
    badge: "● Demo Account",
    color: "var(--phosphor-amber)",
    station: "HQ-MAHA-ENF-01",
    vessel: "SURVEILLANCE SECTOR 4B",
    coordinates: "18°58'N, 72°49'E",
    kpis: [
      { label: "MONITORED TRAWLERS", value: "118 ACTIVE", highlight: "text-amber" },
      { label: "ZONE COMPLIANCE", value: "98.2% NOMINAL", highlight: "text-green" },
      { label: "CYCLONE EXPOSURE", value: "12 CRAFT AT RISK", highlight: "text-red" },
      { label: "PERMIT VERIFICATION", value: "482 LOGGED", highlight: "text-brass" }
    ],
    greeting: "Welcome back, Officer Shinde. 118 licensed fishing vessels are active in Sector 4B. 12 craft detected near the cyclone hazard perimeter.",
    quickActions: [
      { id: "scan-fleet", label: "Scan Active Fleet Positions", icon: "🚢", route: "#/map" },
      { id: "broadcast-alert", label: "Broadcast Fleet Recall", icon: "📢", route: "#/safety" },
      { id: "inspect-permits", label: "Verify Species Quota Log", icon: "📋", route: "#/research" },
      { id: "audit-adapters", label: "AIS Telemetry Mesh Audit", icon: "⚙️", route: "#/admin" }
    ],
    suggestedQuestions: [
      { query: "Monitor active fishing vessels near Cyclone Varuna hazard perimeter", label: "🚢 Fleet Exposure near Cyclone Varuna" },
      { query: "Scan EEZ coastal perimeter for unauthorized deep-sea trawlers", label: "📋 Scan Coastal Border Compliance" },
      { query: "Assess pelagic harvest yields and species quota enforcement", label: "⚖️ Quota & Species Catch Overview" },
      { query: "Issue emergency harbor divert directive to all vessels in Sector 2A", label: "📢 Fleet Safety Recall Advisory" }
    ],
    mapLayers: {
      pfz: true,
      hazards: true,
      vessels: true,
      bathymetry: true
    },
    mapFocus: { coords: [18.98, 72.82], zoom: 7 },
    aiRecommendation: "12 commercial fishing vessels are operating within 40 nm of Tropical Depression Varuna's gale core. Immediate VHF broadcast recall on Channel 16 is advised to avoid 4.8m breaking swells.",
    alertsPriority: ["CYCLONE / GALE", "VESSEL DENSITY", "ROGUE WAVE HAZARD"],
    terminology: {
      intercomPrompt: "Query fleet compliance, permit validation, or sector traffic... (e.g. 'List vessels near storm')",
      kpiTitle: "STATE FISHERIES FLEET SURVEILLANCE MESH",
      directiveLabel: "ENFORCEMENT DIRECTIVE & FLEET ADVISORY"
    }
  },
  {
    id: "researcher",
    name: "Dr. Ananya Sen",
    shortName: "Dr. Ananya",
    roleTitle: "Marine Researcher",
    domain: "Oceanographic & Biogeochemical Research",
    email: "researcher@marix.demo",
    password: "MARIX@123",
    icon: "🔬",
    badge: "● Demo Account",
    color: "#72B4EB",
    station: "NIO-GOA-OCEAN-LAB",
    vessel: "INS SAGAR KANYA II",
    coordinates: "15°29'N, 73°49'E",
    kpis: [
      { label: "SST ANOMALY (30D)", value: "-1.5°C UPWELLING", highlight: "text-green" },
      { label: "CHLOROPHYLL-A PEAK", value: "4.2 mg/m³", highlight: "text-amber" },
      { label: "MODIS/OLCI SYNC", value: "100% SATELLITE", highlight: "text-brass" },
      { label: "THERMOCLINE DEPTH", value: "18m SHALLOWED", highlight: "text-parchment" }
    ],
    greeting: "Welcome back, Dr. Sen. Ekman transport has triggered intensified coastal upwelling with a peak chlorophyll-a reading of 4.2 mg/m³.",
    quickActions: [
      { id: "view-trends", label: "Open SST & Anomaly Trends", icon: "📈", route: "#/research" },
      { id: "view-imagery", label: "Inspect Multispectral Chlorophyll", icon: "🛰️", route: "#/map" },
      { id: "export-data", label: "Export NetCDF4 Sensor Series", icon: "💾", route: "#/admin" },
      { id: "reasoning-engine", label: "Ecosystem Why? Engine", icon: "🧠", route: "#/research" }
    ],
    suggestedQuestions: [
      { query: "Analyze SST anomaly and chlorophyll upwelling dynamics on West Coast", label: "🔬 SST & Chlorophyll Upwelling Analysis" },
      { query: "Correlate Ekman offshore divergence with pelagic biomass concentration", label: "🌿 Ekman Divergence & Biomass Dynamics" },
      { query: "30-day thermocline displacement and nitrate enrichment timeline", label: "📈 Thermocline Depth & Nutrients" },
      { query: "Copernicus Sentinel-3 OLCI and NOAA AVHRR satellite sensor fusion status", label: "🛰️ Satellite Radiometer Calibration" }
    ],
    mapLayers: {
      pfz: true,
      hazards: true,
      vessels: true,
      bathymetry: true
    },
    mapFocus: { coords: [16.55, 72.85], zoom: 8 },
    aiRecommendation: "Ekman offshore surface divergence along the Konkan-Goa coast has elevated cold, nutrient-dense water (26.5°C) into the euphotic zone. Diatom bloom synthesis shows an R² correlation of 0.92 with pelagic fish biomass.",
    alertsPriority: ["THERMAL UPWELLING", "ROGUE WAVE HAZARD", "VESSEL DENSITY"],
    terminology: {
      intercomPrompt: "Transmit oceanographic query, anomaly analysis, or sensor telemetry... (e.g. 'Analyze upwelling index')",
      kpiTitle: "BIOGEOCHEMICAL & SATELLITE REMOTE SENSING",
      directiveLabel: "OCEANOGRAPHIC REASONING & HYPOTHESIS"
    }
  },
  {
    id: "disaster",
    name: "Vikram Malhotra",
    shortName: "Vikram",
    roleTitle: "Disaster Management Authority",
    domain: "NDMA / Coastal Emergency Response",
    email: "disaster@marix.demo",
    password: "MARIX@123",
    icon: "🚨",
    badge: "● Demo Account",
    color: "var(--radar-red)",
    station: "SDMA-DISASTER-OPS-WAR-ROOM",
    vessel: "CRITICAL CRISIS DESK",
    coordinates: "19°04'N, 72°52'E",
    kpis: [
      { label: "CYCLONE THREAT", value: "SEVERITY CRITICAL", highlight: "text-red" },
      { label: "CENTRAL PRESSURE", value: "988 hPa (FALLING)", highlight: "text-red" },
      { label: "MAX GALE WINDS", value: "55 kts (GUSTS 65)", highlight: "text-amber" },
      { label: "PEAK SWELL HEIGHT", value: "5.8m PHENOMENAL", highlight: "text-red" }
    ],
    greeting: "Urgent Command Update, Director Malhotra. Deep Depression Varuna has intensified with central pressure dropping to 988 hPa. Danger Signal No. 8 active.",
    quickActions: [
      { id: "view-cyclone", label: "Focus Cyclone Storm Track", icon: "🌪️", route: "#/map" },
      { id: "evac-directive", label: "Review Emergency Directives", icon: "⚠️", route: "#/safety" },
      { id: "mrcc-call", label: "Contact Coast Guard MRCC", icon: "📞", route: "#/safety" },
      { id: "safe-routing", label: "Evacuation Corridors", icon: "🚢", route: "#/route" }
    ],
    suggestedQuestions: [
      { query: "Deep Depression Varuna landfall trajectory, storm surge, and gale perimeter", label: "🌪️ Cyclone Varuna Track & Landfall" },
      { query: "Assess coastal inundation risk and breaker heights for Saurashtra ports", label: "🌊 Storm Surge & Inundation Risk" },
      { query: "Emergency harbor evacuation staging for Veraval, Okha, and Porbandar", label: "🚨 Port Evacuation Staging Plan" },
      { query: "IMD Doppler Radar velocity scan and precipitation echo intensity", label: "📡 Doppler Radar Storm Core Analysis" }
    ],
    mapLayers: {
      pfz: false,
      hazards: true,
      vessels: true,
      bathymetry: true
    },
    mapFocus: { coords: [20.80, 68.50], zoom: 7 },
    aiRecommendation: "Tropical Depression Varuna is tracking NE at 14 kts. Dangerous breaking swells (4.8–5.8m) threaten the Saurashtra and North Konkan coasts. Port Warning Signal No. 8 must remain hoisted at Okha and Porbandar.",
    alertsPriority: ["CYCLONE / GALE", "ROGUE WAVE HAZARD", "VESSEL DENSITY"],
    terminology: {
      intercomPrompt: "Transmit disaster assessment, evacuation query, or radar check... (e.g. 'Cyclone Varuna storm surge')",
      kpiTitle: "COASTAL HAZARD & CIVIL DEFENSE COMMAND",
      directiveLabel: "EMERGENCY EVACUATION & MARITIME DISTRESS PROTOCOL"
    }
  },
  {
    id: "port",
    name: "Capt. Sanjay Verma",
    shortName: "Capt. Verma",
    roleTitle: "Port / Maritime Authority",
    domain: "VTS, Harbour Master & Marine Traffic",
    email: "port@marix.demo",
    password: "MARIX@123",
    icon: "⚓",
    badge: "● Demo Account",
    color: "var(--brass)",
    station: "VTS-MUMBAI-PORT-CONTROL",
    vessel: "MUMBAI HARBOUR MASTER",
    coordinates: "18°55'N, 72°50'E",
    kpis: [
      { label: "OUTER ANCHORAGE", value: "48 VESSELS", highlight: "text-amber" },
      { label: "FAIRWAY STATUS", value: "CONGESTION HIGH", highlight: "text-amber" },
      { label: "UKC CLEARANCE", value: "3.2m AT LOW TIDE", highlight: "text-brass" },
      { label: "VISIBILITY", value: "1.2 nm (DENSE FOG)", highlight: "text-red" }
    ],
    greeting: "Welcome back, Capt. Verma. 48 vessels at Mumbai Outer Anchorage. Reduced visibility (<1.2 nm) requires mandatory radar guard zones.",
    quickActions: [
      { id: "fairway-radar", label: "Inspect Fairway Vessel Traffic", icon: "🗺️", route: "#/map" },
      { id: "congestion-advisory", label: "Review Traffic Congestion", icon: "⚠️", route: "#/safety" },
      { id: "channel-depth", label: "Check Under-Keel Clearance", icon: "🌊", route: "#/route" },
      { id: "vts-mesh", label: "Check AIS Stream Latency", icon: "⚙️", route: "#/admin" }
    ],
    suggestedQuestions: [
      { query: "Mumbai Port outer fairway vessel congestion and fog density", label: "🚢 Outer Fairway Traffic Congestion" },
      { query: "Tidal window and Under-Keel Clearance for inbound VLCC tankers", label: "🌊 UKC & Draught Safety for Tankers" },
      { query: "Grounding hazard analysis at Malacca Banks sand shoals during spring low tide", label: "⚠️ Malacca Banks Shoal Hazards" },
      { query: "Pareto safe route vs shortest route for Mumbai to Porbandar crossing", label: "🧭 Safe Navigation Passage (Mumbai → Porbandar)" }
    ],
    mapLayers: {
      pfz: false,
      hazards: true,
      vessels: true,
      bathymetry: true
    },
    mapFocus: { coords: [18.95, 72.88], zoom: 9 },
    aiRecommendation: "High vessel density in Mumbai Port outer fairway combined with morning fog requires all vessels >10,000 DWT to maintain 0.5 nm separation and active VHF CH 16 watch. Draught restrictions in effect for berths 4–7.",
    alertsPriority: ["VESSEL DENSITY", "CYCLONE / GALE", "ROGUE WAVE HAZARD"],
    terminology: {
      intercomPrompt: "Transmit VTS traffic query, draught check, or berth advisory... (e.g. 'Anchorage queue status')",
      kpiTitle: "VESSEL TRAFFIC SERVICE & HARBOUR NAVIGATION",
      directiveLabel: "PORT CAPTAINCY & NAVIGATION DIRECTIVE"
    }
  },
  {
    id: "aquaculture",
    name: "Priya Nair",
    shortName: "Priya",
    roleTitle: "Aquaculture Operator",
    domain: "Mariculture, Sea-Cages & Water Quality",
    email: "aquaculture@marix.demo",
    password: "MARIX@123",
    icon: "🦐",
    badge: "● Demo Account",
    color: "var(--phosphor-green)",
    station: "DEVGAD-MARICULTURE-CLUSTER",
    vessel: "SEA-CAGE SECTOR 3",
    coordinates: "16°22'N, 73°22'E",
    kpis: [
      { label: "DISSOLVED OXYGEN", value: "6.8 mg/L (GOOD)", highlight: "text-green" },
      { label: "WATER TEMP", value: "27.4°C STABLE", highlight: "text-parchment" },
      { label: "ALGAL BLOOM RISK", value: "LOW (HAB NEGATIVE)", highlight: "text-green" },
      { label: "CAGE MOORING STRESS", value: "1.1m SLIGHT SWELL", highlight: "text-amber" }
    ],
    greeting: "Welcome back, Priya. Dissolved oxygen levels in Devgad Sea-Cages are optimal at 6.8 mg/L. No harmful algal bloom detected.",
    quickActions: [
      { id: "water-quality", label: "Check Marine Water Quality", icon: "🧪", route: "#/research" },
      { id: "bloom-monitor", label: "Harmful Algal Bloom Watch", icon: "🌿", route: "#/map" },
      { id: "swell-stress", label: "Inspect Cage Mooring Swell", icon: "🌊", route: "#/safety" },
      { id: "feed-optim", label: "Biomass Growth & Feed Log", icon: "📊", route: "#/research" }
    ],
    suggestedQuestions: [
      { query: "Water quality, salinity, and dissolved oxygen forecast for coastal cage farms", label: "🦐 Cage Water Quality & Dissolved Oxygen" },
      { query: "Harmful Algal Bloom (HAB) and dinoflagellate risk assessment near Ratnagiri", label: "🌿 HAB & Dinoflagellate Bloom Risk" },
      { query: "Offshore sea-cage mooring wave stress under current 1.8m swell", label: "🌊 Mooring Swell & Structural Stress" },
      { query: "Sea surface temperature fluctuations and impact on feed conversion ratio", label: "🌡️ SST Impact on Fish Feed Conversion" }
    ],
    mapLayers: {
      pfz: true,
      hazards: true,
      vessels: false,
      bathymetry: true
    },
    mapFocus: { coords: [16.55, 72.85], zoom: 9 },
    aiRecommendation: "Dissolved oxygen is currently 6.8 mg/L with stable salinity (34.2 ppt). Minor thermocline shift detected 12 nm offshore; continuous water quality sampling recommended ahead of evening tide reversal.",
    alertsPriority: ["THERMAL UPWELLING", "ROGUE WAVE HAZARD", "CYCLONE / GALE"],
    terminology: {
      intercomPrompt: "Query water quality, algal bloom threat, or sea-cage parameters... (e.g. 'Check DO forecast')",
      kpiTitle: "MARICULTURE & BIO-TELEMETRY MONITORING",
      directiveLabel: "AQUACULTURE OPERATIONAL DIRECTIVE"
    }
  }
];

export const GUEST_USER = {
  id: "guest",
  name: "Bridge Guest",
  shortName: "Guest",
  roleTitle: "Mariner / Observer",
  domain: "General Maritime Navigation",
  email: "guest@marix.demo",
  password: "",
  icon: "⚓",
  badge: "● Unauthenticated Demo",
  color: "var(--brass)",
  station: "GUEST-STATION",
  vessel: "VESSEL OBSERVER",
  coordinates: "18.98° N, 72.82° E",
  kpis: [
    { label: "MONITORED AREA", value: "1.2M NM²", highlight: "text-parchment" },
    { label: "PFZ THERMAL FRONTS", value: "4 DETECTED", highlight: "text-green" },
    { label: "STORM HAZARD INDEX", value: "78/100 (HIGH)", highlight: "text-red" },
    { label: "ACTIVE AIS VESSELS", value: "240+ TRACKED", highlight: "text-amber" }
  ],
  greeting: "Welcome to the ORCA Marine Intelligence & Reasoning Bridge Console.",
  quickActions: [
    { id: "demo-login", label: "Select Stakeholder Demo Account", icon: "👤", route: "#/login" },
    { id: "open-chat", label: "Open Reasoning Intercom", icon: "💬", route: "#/chat" },
    { id: "open-map", label: "Open Marine Map", icon: "🗺️", route: "#/map" },
    { id: "open-safety", label: "Safety & Hazard Gauges", icon: "🛡️", route: "#/safety" }
  ],
  suggestedQuestions: [
    { query: "Assess cyclone alert and sea state hazard near Mumbai coast", label: "🌪️ Cyclone & Sea State (Mumbai)" },
    { query: "Find high-yield fishing zones with thermal fronts on Konkan coast", label: "🐟 PFZ Discovery (Konkan Coast)" },
    { query: "Safe route vs shortest route from Veraval to Ratnagiri", label: "🚢 Route Planner (Veraval → Ratnagiri)" },
    { query: "Analyze SST anomaly and chlorophyll upwelling dynamics", label: "🔬 SST & Upwelling Research" }
  ],
  mapLayers: {
    pfz: true,
    hazards: true,
    vessels: true,
    bathymetry: true
  },
  mapFocus: { coords: [18.5, 72.2], zoom: 7 },
  aiRecommendation: "Autonomous marine intelligence operational across Arabian Sea Sector 4B. Choose a stakeholder demo account to unlock customized operational directives.",
  alertsPriority: ["CYCLONE / GALE", "ROGUE WAVE HAZARD", "THERMAL UPWELLING", "VESSEL DENSITY"],
  terminology: {
    intercomPrompt: "Transmit operational query or coordinates... (e.g. 'Assess cyclone risk near Mumbai')",
    kpiTitle: "GENERAL BRIDGE TELEMETRY",
    directiveLabel: "GENERAL SAFETY ADVISORY"
  }
};
