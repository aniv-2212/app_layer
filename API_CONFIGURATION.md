# ThreatLens — API Configuration Reference

> Never commit API keys. All keys live in `backend/.env` (gitignored).

## External Threat-Intelligence Services

| Service | Environment Variable | API Key Required | Backend Service File | Backend Endpoint | Frontend Consumer | Real-Time or REST | Current Status |
|---|---|---|---|---|---|---|---|
| CISA KEV | *(none — public feed)* | No | `backend/app/services/external/cisa_kev.py` | `GET /api/custom/cisa/kev` | `useCisaKev` hook → `ThreatIntelligence.tsx` | REST (cached 1h) | ✅ CONFIGURED |
| Have I Been Pwned (breach catalog) | *(none — public endpoint)* | No | `backend/app/services/external/hibp.py` | `GET /api/custom/hibp/breaches` | `useHibpBreaches` hook → `ThreatIntelligence.tsx` | REST (cached 1h) | ✅ CONFIGURED |
| Have I Been Pwned (account) | `HIBP_API_KEY` | Yes | `backend/app/services/external/hibp.py` | `GET /api/custom/hibp/account/{account}` | *(none in frontend)* | REST | ⚠️ NOT CONFIGURED (key empty) |
| IPInfo | `IPINFO_TOKEN` | No (optional) | `backend/app/services/external/ipinfo.py` | `GET /api/custom/ipinfo/{ip}` | *(via `api.ipinfo` in api.ts)* | REST (cached 1h) | ✅ CONFIGURED |
| PhishTank | `PHISHTANK_APP_KEY` | No (optional) | `backend/app/services/external/phishtank.py` | `GET /api/custom/phishtank/check` | *(via `api.phishtankCheck`)* | REST (cached 15m) | ✅ CONFIGURED |
| Cloudflare Radar | `CLOUDFLARE_RADAR_TOKEN` | Yes | `backend/app/services/external/cloudflare_radar.py` | `GET /api/custom/radar/attacks` | *(via `api.radarAttacks`)* | REST (cached) | ⚠️ NOT CONFIGURED (key returns 401) |
| Shodan | `SHODAN_API_KEY` | Yes | `backend/app/services/external/shodan.py` | `GET /api/custom/shodan/host/{ip}` | *(via `api.shodanHost`)* | REST (cached) | ⚠️ NOT CONFIGURED (key returns 401) |
| VirusTotal | `VIRUSTOTAL_API_KEY` | Yes | `backend/app/services/external/virustotal.py` | `GET /api/custom/virustotal/ip/{ip}` | *(via `api.virustotalIp`)* | REST (cached 15m) | ⚠️ NOT CONFIGURED (key returns 401) |
| AlienVault OTX | `OTX_API_KEY` | Yes | `backend/app/services/external/otx.py` | `GET /api/custom/otx/pulses` | `useOtxPulses` hook → `ThreatIntelligence.tsx` | REST (cached) | ✅ CONFIGURED (operational) |
| AbuseIPDB | `ABUSEIPDB_API_KEY` | Yes | `backend/app/services/external/abuseipdb.py` | `GET /api/custom/abuseipdb/check/{ip}` | *(via `api.abuseipdbCheck`)* | REST (cached 15m) | ⚠️ NOT CONFIGURED (key returns 401) |

## Attack Simulation / Internal Endpoints

| Feature | Data Source | Backend Endpoint | Frontend Consumer | Real-Time | API Key Required | Status |
|---|---|---|---|---|---|---|
| Health | FastAPI | `GET /health` | `api.health()` | No | No | ✅ |
| Attack events (filtered) | In-memory deque | `GET /api/attacks` | `api.attacks()` → stores | No | No | ✅ |
| Country list | `countries.json` | `GET /api/countries` | `api.countries()` → stores | No | No | ✅ |
| Statistics | In-memory repo | `GET /api/statistics` | `api.statistics()` → stores | No | No | ✅ |
| Statistics summary | In-memory repo | `GET /api/statistics/summary` | `useStatisticsSummary` | No | No | ✅ |
| Heatmap | In-memory repo | `GET /api/heatmap` | `api.heatmap()` → stores | No | No | ✅ |
| Timeline replay | In-memory repo | `GET /api/replay` | `api.replay()` → stores | No | No | ✅ |
| Dashboard snapshot | Aggregated | `GET /api/dashboard/snapshot` | `api.dashboardSnapshot()` → stores | No | No | ✅ |
| Dashboard metadata | Static enums | `GET /api/dashboard/metadata` | `api.dashboardMetadata()` | No | No | ✅ |
| Country rollup | In-memory repo | `GET /api/dashboard/countries/{name}/rollup` | `api.countryRollup()` | No | No | ✅ |
| Export (JSON/CSV) | In-memory repo | `GET /api/dashboard/export` | `api.exportJson()` / `api.exportCsv()` | No | No | ✅ |
| Stream status | StreamService | `GET /api/stream/status` | `api.streamStatus()` | No | No | ✅ |
| Stream start | StreamService | `POST /api/stream/start` | `api.streamStart()` | No | No | ✅ |
| Stream stop | StreamService | `POST /api/stream/stop` | `api.streamStop()` | No | No | ✅ |
| Stream tick | StreamService | `POST /api/stream/tick` | `api.streamTick()` | No | No | ✅ |
| Stream snapshot | StreamService | `POST /api/stream/snapshot` | `api.streamSnapshot()` | No | No | ✅ |
| Intel status | IntelHub | `GET /api/custom/intel/status` | `api.intelStatus()` | No | No | ✅ |
| Intel snapshot | IntelHub | `GET /api/custom/intel/snapshot` | `api.intelSnapshot()` / `intel:update` socket | Yes + REST | No | ✅ |

## Socket.IO Events

| Event | Direction | Payload | Broadcast Interval | Status |
|---|---|---|---|---|
| `connection:success` | Server → Client | `{ message, sid, events[] }` | On connect | ✅ |
| `attack:new` | Server → Client | Attack event object | Every `SOCKET_INTERVAL` (1s) | ✅ |
| `attack:summary` | Server → Client | Severity breakdown | Every `SUMMARY_INTERVAL` (5s) | ✅ |
| `heatmap:update` | Server → Client | `{ data, total, updated_at }` | Every `SUMMARY_INTERVAL` (5s) | ✅ |
| `statistics:update` | Server → Client | Full statistics | Every `SUMMARY_INTERVAL` (5s) | ✅ |
| `timeline:update` | Server → Client | Recent attacks array | Every `SUMMARY_INTERVAL` (5s) | ✅ |
| `intel:update` | Server → Client | Intel snapshot | Every `INTEL_BROADCAST_INTERVAL` (120s) | ✅ |
