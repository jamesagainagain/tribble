// ============================================================
// API CONTRACT — Documentation Only (no implementation)
// When backend is ready, each entry becomes a React Query hook.
// BASE URL: import.meta.env.VITE_API_BASE_URL
// ============================================================

// AUTH
// POST /auth/login       → { access_token: string, refresh_token: string, user: User }
// POST /auth/register    → { status: 'pending' }
// POST /auth/refresh     → { access_token: string }
// POST /auth/logout      → 204
// GET  /auth/me          → User

// INCIDENTS
// GET  /incidents                → { data: Incident[], meta: { total, page, per_page } }
// POST /incidents/geojson        → GeoJSON.FeatureCollection (body: FilterParams)
// GET  /incidents/:id            → Incident
// POST /incidents/:id/verify     → Incident
// GET  /incidents/arcs           → { source: [lng,lat], target: [lng,lat] }[]
// POST /incidents/export         → Blob

// SETTLEMENTS
// GET  /settlements/geojson      → GeoJSON.FeatureCollection

// RISK
// GET  /risk/heatmap             → { lat, lng, weight }[] (query: bbox, date_range)
// GET  /risk/zones               → { region_id, name, score, geometry }[]
// GET  /risk/score/:id           → { score, trend, factors }

// AGENT
// POST /agent/query              → ReadableStream SSE of AgentResponseBlock[]
// GET  /agent/history            → AgentMessage[]
// DELETE /agent/history          → 204

// DRONES
// GET  /drones                   → Drone[]
// GET  /drones/:id               → Drone
// POST /drones/:id/dispatch      → Drone (body: { target_lat, target_lng, mission_type })
// POST /drones/:id/recall        → Drone

// REALTIME (WebSocket — wire when backend is ready)
// WS /ws/drones/telemetry        → DronePosition at up to 2Hz per drone
// WS /ws/alerts                  → Alert push on new critical incidents

// IMAGERY
// GET /imagery/tiles/:z/:x/:y    → image/png (Mapbox-compatible tile endpoint)
