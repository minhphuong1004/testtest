# BREATHE – Contribution & Integration Guide

> **Target:** 6-Person Hackathon Team (24-Hour Velocity)  
> **Structure:** Decoupled Frontend (`frontend/`) and Backend (`backend/`)  
> **Goal:** Rapid parallel progress without merge conflicts or regressions.

---

## 1. Branch Naming Conventions

All work must occur on dedicated, scoped topic branches branching from `main`.

| Prefix | Scope / Workstream | Example |
| :--- | :--- | :--- |
| `feat/` | New features (frontend or backend) | `feat/frontend-comparison-modal` |
| `data/` | N01 Data ingestion & preprocessing | `data/nasa-gibs-aod-ingest` |
| `backend/` | N01 Backend API routes & processors | `backend/add-range-endpoint` |
| `audio/` | N03 Sonification algorithms & Web Audio | `audio/binaural-panning` |
| `science/` | N02 Scientific validation & copy | `science/aod-vs-aqi-docs` |
| `ui/` | N05 Visual design & styling polish | `ui/atmospheric-halo-glow` |
| `fix/` | Bug fixes or interface adjustments | `fix/timeline-step-boundary` |
| `docs/` | Documentation & presentation | `docs/presentation-slides` |

---

## 2. Commit Message Convention

Follow standard Conventional Commits format:
```text
<type>(<scope>): <short description in imperative present tense>
```

**Allowed Types:**
- `feat`: A new feature for user or engine.
- `fix`: A bug fix.
- `data`: NASA dataset updates or transformations.
- `audio`: Sound synthesis or mapping updates.
- `docs`: Documentation updates.
- `style`: Formatting, CSS, or visual tweaks.
- `refactor`: Code refactoring without behavioral changes.
- `test`: Adding or updating verification tests.

**Examples:**
```text
feat(frontend): connect dataService to FastAPI backend endpoint
data(backend): add MODIS AOD 550nm cleaning processor with Pandas
audio(frontend): tune exponential frequency ramp to 80ms
docs(science): clarify column AOD distinction from ground-level AQI
```

---

## 3. File Ownership Matrix

| Directory / File | Primary Owner | Secondary / Reviewer |
| :--- | :--- | :--- |
| `backend/src/data/` | **N01 – Data Engineering** | N02 |
| `backend/src/processors/` | **N01 – Data Engineering** | N02 |
| `backend/src/api/` | **N01 – Data Engineering** | N04, N06 |
| `docs/DATA_CONTRACT.md`, `docs/SRS.md` | **N02 – Scientific Research** | N01, N04 |
| `frontend/src/types/` | **N02 & N04** | N01, N03 |
| `frontend/src/services/sonificationService.ts` | **N03 – Sonification** | N04 |
| `frontend/src/hooks/useSonification.ts` | **N03 – Sonification** | N04 |
| `frontend/src/components/audio/` | **N03 & N04** | N05 |
| `frontend/src/components/visualization/` | **N04 – Frontend** | N05 |
| `frontend/src/app/` | **N04 – Frontend** | N05 |
| `frontend/public/` | **N05 – UI/UX & Storytelling** | N04 |
| `docs/TEAM_TASKS.md`, `README.md` | **N06 – Integration & QA** | All |

*Rule:* If you must modify a file owned by another workstream, coordinate with the owner in chat first!

---

## 4. Pull Request & Integration Workflow

1. **Pull Latest Main:** Before opening a PR, ensure your branch is up-to-date:
   ```bash
   git fetch origin
   git merge origin/main
   ```
2. **Local Verification:**
   - **Frontend changes:**
     ```bash
     cd frontend
     npm run typecheck
     npm run lint
     ```
   - **Backend changes:**
     ```bash
     pytest backend/tests
     ```
3. **PR Description:** Include:
   - Workstream ID (e.g. `[N01]`, `[N04]`)
   - Summary of changes
   - Manual testing steps executed
   - Confirmation that no secrets or mock data were misrepresented as verified NASA data.
4. **Approval Gate:** Every PR requires at least 1 review approval (N06 or the module owner).
