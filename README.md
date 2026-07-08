# CYBER AI — ThreatLens

> *"We don't just observe threats. We teach systems to understand them."*

**CYBER AI** is a unified, AI-powered SOC (Security Operations Center) platform that integrates real-time attack visualization, machine learning-based URL threat detection, multi-source threat intelligence aggregation, and an AI cybersecurity assistant — all within a single interactive enterprise-grade dashboard.

Built by **Team VYOMX**.

---

## Features

| Feature | Description |
|---------|-------------|
| **Live Threat Map** | Real-time global attack visualization using MapLibre + Deck.gl (ArcLayer, ScatterplotLayer, HeatmapLayer) |
| **SOC Dashboard** | KPI cards, AI threat summary, attack funnel, network pulse, analyst workload metrics |
| **AI URL Scanner** | 33-feature XGBoost + heuristic dual scoring with WHOIS/DNS/SSL domain intelligence |
| **Threat Intelligence Hub** | Multi-source aggregation from CISA KEV, VirusTotal, Shodan, AbuseIPDB, OTX, PhishTank, HIBP, IPInfo, Cloudflare Radar |
| **AI Security Assistant** | LLM-powered chatbot with cybersecurity context injection |
| **Attack Analytics** | Historical trends, country analytics, endpoint tracking, exportable reports |
| **Vulnerability Center** | CISA KEV-powered asset risk management, CVSS distribution, patch tracking |
| **Malware Analysis** | Sample upload, VirusTotal/AbuseIPDB lookup, YARA rules, MITRE ATT&CK mapping |
| **Incident Response** | SOC case management with assignment workflow, priority/status tracking |
| **Log Analysis** | Search/filter workspace for auth, firewall, Windows, Linux logs |
| **Network Monitoring** | Topology visualization, active connections, latency monitor, protocol distribution |
| **Application Layer Dashboard** | Application-specific security analytics and monitoring |

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript 6.0** — Component architecture
- **Vite 8** — Build tool and dev server
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion 12** — Declarative animations
- **Zustand 5** — State management
- **React Router 7** — Routing
- **MapLibre GL** + **react-map-gl** — Map rendering
- **Deck.gl** — WebGL data visualization
- **ECharts** — Enterprise charting
- **TanStack Table** — Data tables with sorting/filtering/pagination
- **Socket.IO Client** — Real-time communication
- **Lucide React** — Icons

### Backend
- **Python 3.12** + **FastAPI** — REST API framework
- **Uvicorn** — ASGI server
- **python-socketio** — Real-time WebSocket transport
- **XGBoost** — ML model for URL threat scoring
- **scikit-learn** — ML pipeline utilities
- **pydantic v2** — Data validation

### DevOps
- **Vite** — Frontend build pipeline
- **Uvicorn** — Backend serving
- **Environment-based config** — `.env` files

---

## Project Structure

```
app_layeer/
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── components/               # Shared UI components
│   │   ├── pages/                    # Route pages
│   │   │   ├── Landing.tsx           # Cinematic landing page
│   │   │   ├── Dashboard.tsx         # Main SOC dashboard
│   │   │   ├── AttackAnalytics.tsx   # Attack data analytics
│   │   │   ├── LiveMap.tsx           # Global threat map
│   │   │   ├── UrlScanner.tsx        # AI URL scanner page
│   │   │   ├── ThreatIntel.tsx       # Threat intelligence hub
│   │   │   ├── VulnerabilityCenter.tsx
│   │   │   ├── MalwareAnalysis.tsx
│   │   │   ├── IncidentResponse.tsx
│   │   │   ├── NetworkMonitor.tsx
│   │   │   ├── LogAnalysis.tsx
│   │   │   ├── AppLayer.tsx          # Application layer security
│   │   │   ├── Settings.tsx
│   │   │   └── Team.tsx              # Team VYOMX page
│   │   ├── stores/                   # Zustand state stores
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities and helpers
│   │   └── types/                    # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                           # Python FastAPI server
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry point
│   │   ├── config.py                 # Configuration and settings
│   │   ├── routers/                  # REST API route handlers
│   │   ├── services/                 # Business logic layer
│   │   │   ├── attack_generator.py   # Attack simulation engine
│   │   │   ├── stream_service.py     # Socket.IO event streaming
│   │   │   ├── url_scanner_service.py # ML-based URL scanner
│   │   │   ├── threat_intel_service.py # Intel aggregation hub
│   │   │   └── stats_service.py      # Statistics computation
│   │   ├── models/                   # Pydantic response models
│   │   ├── ml/                       # ML model + feature extraction
│   │   │   ├── url_model.py          # XGBoost wrapper
│   │   │   ├── features.py           # 33-feature extractor
│   │   │   └── heuristic_engine.py   # 41-rule heuristic scorer
│   │   └── data/                     # Static data (countries, etc.)
│   ├── models/                       # Trained model files
│   ├── requirements.txt
│   └── .env.example
│
└── VIVA_PRESENTATION.md              # Viva/presentation guide
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open at `http://localhost:5173/`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (optional for demo)

python run.py
```

Backend runs at `http://localhost:8000/`
API docs at `http://localhost:8000/docs`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attacks` | Recent attacks list |
| GET | `/api/attacks/stats` | Attack statistics |
| GET | `/api/countries` | Country data with coordinates |
| GET | `/api/url/scan` | Scan a URL (query param: `url`) |
| GET | `/api/dashboard` | Dashboard aggregates |
| GET | `/api/timeline` | Attack timeline data |
| GET | `/api/heatmap` | Heatmap geo-data |
| GET | `/api/summary` | AI-generated threat summary |
| GET | `/api/anomaly` | ML-based anomaly timeline |
| GET | `/api/predictions` | AI threat predictions |
| POST | `/api/chat` | AI assistant chat message |
| GET | `/api/threat-intel` | Aggregated threat intelligence |
| GET | `/api/incidents` | Incident response cases |
| POST | `/api/incidents` | Create incident case |
| PATCH | `/api/incidents/{id}` | Update incident case |
| GET | `/api/logs` | Security logs |
| GET | `/api/reports` | Exportable reports |
| GET | `/api/network/connections` | Active network connections |
| WS | Socket.IO | Real-time attack streaming |

---

## Configuration

Copy `.env.example` to `.env` and configure:

```env
# OpenAI-compatible LLM for AI Assistant
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini

# Threat Intelligence API Keys (optional)
VIRUSTOTAL_API_KEY=
SHODAN_API_KEY=
ABUSEIPDB_API_KEY=
IPINFO_API_KEY=

# Server
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173
```

---

## Build for Production

```bash
# Frontend
cd frontend
npm run build

# Preview
npm run preview
```

---

## Team VYOMX

| Member | Role |
|--------|------|
| **Anmol Verma** | Full Stack Developer — System architecture, frontend/backend development, real-time streaming |
| **Jasleen Kaur** | ML Engineer — XGBoost model training, feature extraction, heuristic engine |
| **Lokankshi Gupta** | Frontend Developer — Dashboard pages, threat intel, vulnerability center, UI design |
| **Karun Behl** | QA & Testing — API testing, integration testing, validation |

---

## License

Proprietary — Team VYOMX
