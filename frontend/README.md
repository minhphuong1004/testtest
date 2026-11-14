# BREATHE – Frontend Client

> **Technology Stack:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, Recharts, Web Audio API  
> **Challenge:** NASA Space Apps Challenge 2026 – The Earth Information Jukebox

---

## 1. Overview & Responsibilities

The `frontend/` directory contains the complete client-side application for BREATHE:
- **Atmospheric Visualizations:** Interactive satellite imagery with real-time dynamic aerosol scattering halo simulations.
- **Observation Timeline:** Scrubbable temporal sequencer.
- **Sonification Engine:** Native Web Audio API synthesizer mapping column optical depth to acoustic frequency and harmonic overtone layers.
- **Time-Series Charting:** Recharts area plot synchronized with active observation cursors.
- **Scientific Context:** Educational panels enforcing scientific distinctions (AOD ≠ AQI) and NASA mission provenance.
- **Backend Integration:** `dataService.ts` queries the Python FastAPI Backend if reachable, falling back seamlessly to local mock datasets when offline.

*Note on Audio:* The sonification engine is implemented 100% on the client using the browser's native Web Audio API. It does not depend on audio streaming from the backend.

---

## 2. Getting Started

### Prerequisites
- Node.js `v18.17.0+` or `v20+` (Node.js `v24.x` verified)
- `npm` or `pnpm`

### Installation & Execution

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 3. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server on port 3000 |
| `npm run build` | Compiles production build |
| `npm run start` | Starts Next.js production server |
| `npm run lint` | Runs Next.js ESLint verification |
| `npm run typecheck` | Validates TypeScript types across `src/` without emitting |
| `npm run format` | Runs Prettier code formatting |

---

## 4. Connecting to the Backend

By default, the frontend runs autonomously with high-fidelity local mock data. To connect to the Python FastAPI backend:
1. Ensure the backend is running at `http://localhost:8000` (see `backend/README.md`).
2. Verify `NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"` in `frontend/.env.local`.
3. When the page loads, `dataService` will automatically fetch live/processed observations from the backend.
