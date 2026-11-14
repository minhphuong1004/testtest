# BREATHE – Earth Information Jukebox

> **Hear what the atmosphere is telling us.**  
> Built for the **NASA Space Apps Challenge 2026** – *The Earth Information Jukebox*  
> An interactive Earth science sonification experience translating atmospheric observations into dynamic sound.

---

## 1. Project Overview & Architecture

BREATHE is architected into two decoupled modules to maximize parallel development velocity for a 6-person hackathon team:

- **`frontend/`**: Interactive web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Web Audio API**. Manages satellite visual representations, temporal timelines, time-series telemetry charts, and real-time client-side acoustic sonification.
- **`backend/`**: Scientific data service built with **Python 3.12**, **FastAPI**, **Pydantic v2**, and **Pandas**. Responsible for NASA Earthdata retrieval, data cleaning, timestamp/unit normalization, provenance validation, and serving typed APIs.
- **`docs/`**: Shared architectural contracts, specifications (SRS, Data Contract, Sonification Contract), and team task breakdowns.

```text
BREATHE-EarthJukebox/
├── frontend/                   # Client application (Next.js, React, Web Audio)
│   ├── public/                 # Static visual & audio assets
│   ├── src/                    # App Router, components, hooks, services, types
│   ├── package.json
│   └── README.md
│
├── backend/                    # Scientific processing & API (FastAPI, Pandas)
│   ├── src/                    # FastAPI routes, schemas, processors, data
│   ├── tests/                  # Pytest test suite
│   ├── scripts/                # CLI data ingestion scripts (N01)
│   ├── requirements.txt
│   └── README.md
│
├── docs/                       # Shared team contracts & specifications
│   ├── PROJECT_OVERVIEW.md     # Vision & user journey
│   ├── ARCHITECTURE.md         # Decoupled system architecture
│   ├── SRS.md                  # Software Requirements Specification (IEEE 830)
│   ├── DATA_CONTRACT.md        # Observation & Dataset schema definitions
│   ├── SONIFICATION_CONTRACT.md# Audio transfer functions & Web Audio graph
│   ├── TEAM_TASKS.md           # 24-hour sprint roadmap (N01 - N06)
│   └── CONTRIBUTING.md         # Git conventions & file ownership matrix
│
├── .editorconfig
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Quick Start Guide

### A. Running the Frontend (Client)

The frontend can run completely independently using pre-bundled atmospheric datasets, or connect to the Python backend.

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Frontend will be accessible at: **[http://localhost:3000](http://localhost:3000)**

#### Frontend Verification Commands
```bash
npm run typecheck    # Validate TypeScript types
npm run lint         # Run Next.js ESLint
npm run build        # Production build
```

---

### B. Running the Backend (Scientific API)

The backend provides data ingestion pipelines and REST endpoints for verified NASA observations.

```bash
# 1. Navigate to repository root
cd D:\explode\BREATHE-EarthJukebox

# 2. Create and activate Python virtual environment
python -m venv backend/.venv

# Windows PowerShell:
backend\.venv\Scripts\Activate.ps1
# Linux/macOS:
source backend/.venv/bin/activate

# 3. Install Python dependencies
pip install -r backend/requirements.txt

# 4. Configure environment
cp backend/.env.example backend/.env

# 5. Start FastAPI server
python -m uvicorn backend.src.main:app --reload --port 8000
```

- API Base URL: **[http://localhost:8000](http://localhost:8000)**
- Interactive Swagger Documentation: **[http://localhost:8000/docs](http://localhost:8000/docs)**

#### Backend Verification Commands
```bash
pytest backend/tests                                                 # Run API test suite
python backend/scripts/fetch_nasa_data.py --variable aod             # Test data ingestion
```

---

## 3. Team Workstream Mapping

| Workstream | Role | Primary Directory | Core Technologies |
| :--- | :--- | :--- | :--- |
| **N01 – Data Engineering** | NASA Earthdata ingestion & normalization | `backend/` | Python, Pandas, CMR/GIBS APIs |
| **N02 – Scientific Research** | Variable definition, physical validation, units | `docs/`, `backend/src/processors/` | Atmospheric Physics, Radiative Transfer |
| **N03 – Sonification** | Web Audio API synthesizer, harmonic mapping | `frontend/src/services/`, `hooks/` | Web Audio API, Digital Signal Synthesis |
| **N04 – Frontend Development** | App Router, timeline, charts, UI state | `frontend/src/` | Next.js, React, Tailwind CSS, Recharts |
| **N05 – UI/UX & Storytelling** | Visual identity, NASA visual assets, design | `frontend/public/`, `src/app/` | UI/UX Design, Atmospheric HUD |
| **N06 – Integration & QA** | Architecture, contracts, PR review, testing | Root, `docs/` | Code Quality, System Integration |

---

## 4. Scientific Rigor & Data Attribution Policy

1. **Aerosol Optical Depth (AOD) ≠ Air Quality Index (AQI):**
   Column AOD is a dimensionless physical measure of total vertical sunlight extinction through the entire atmospheric column. Under scientific guidelines, AOD must **never** be labeled, reported, or conflated with surface Air Quality Index (AQI), which is calculated from ground-level particulate matter (PM2.5, PM10).
2. **Explicit Demarcation of Mock vs. Verified Data:**
   When running offline, the frontend utilizes local mock observations marked with `isMock: true` and displays an amber warning badge. When connected to the backend with processed NASA observations, it displays an emerald verified badge. Mock values must never be cited as real NASA observations.
3. **Traceable NASA Sources:**
   All verified observations originate from accredited NASA missions (MODIS on Terra/Aqua, VIIRS on Suomi NPP/NOAA-20) and cite official NASA Earthdata catalog URLs.

---

## 5. License

Distributed under the MIT License. Built for the NASA Space Apps Challenge 2026.
