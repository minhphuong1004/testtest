# BREATHE – Team Task Breakdown (24-Hour Hackathon Roadmap)

> **Challenge:** NASA Space Apps Challenge 2026 – The Earth Information Jukebox  
> **Team Structure:** 6 Specialized Workstreams (N01 – N06)  
> **Architecture:** Decoupled Frontend (Next.js) & Backend (FastAPI / Pandas)  
> **Sprint Horizon:** 24 Hours

---

## Workstream N01 – Data Engineering (Backend Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N01-01** | **NASA Earthdata Retrieval CLI**<br>Build automated script to download MODIS AOD 550nm granules from NASA Earthdata / GIBS. | N01 Lead | **P0** | None | Script fetches calibrated observations with verifiable provenance. | `backend/scripts/fetch_nasa_data.py` |
| **N01-02** | **Pandas Preprocessing Pipeline**<br>Clean raw NASA granules, filter fill values (`-9999`), and standardize UTC timestamps. | N01 Lead | **P0** | N01-01 | Normalized dataset conforms to `DatasetSchema`. | `backend/src/processors/nasa_aod_processor.py` |
| **N01-03** | **FastAPI Endpoints Delivery**<br>Serve processed observations over `/api/v1/observations/aod` and `/range`. | N01 Lead | **P0** | N01-02 | REST endpoints return validated JSON with CORS headers. | `backend/src/api/routes/observations.py` |
| **N01-04** | **Multi-Variable Stretch (CO2/Methane)**<br>Optional stretch goal: Ingest second atmospheric variable (e.g. OCO-2 Carbon Dioxide). | N01 Lead | **P2** | N01-03 | Additional dataset available in dropdown/switcher. | `backend/src/data/processed/` |

---

## Workstream N02 – Scientific Research (Science Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N02-01** | **Validate Data Variables & Units**<br>Verify that AOD units are labeled as dimensionless and never conflated with AQI. | N02 Lead | **P0** | None | Schema and documentation validated by science lead. | `docs/DATA_CONTRACT.md` |
| **N02-02** | **Sonification Transfer Function Justification**<br>Document scientific justification for mapping optical extinction to audio frequency & overtone density. | N02 Lead | **P0** | None | Mapping rationale fully detailed with citations. | `docs/SONIFICATION_CONTRACT.md` |
| **N02-03** | **Atmospheric Event Narratives**<br>Draft descriptions for 6 specific historical aerosol events (e.g., Saharan dust transport, Canadian wildfire smoke). | N02 Lead | **P1** | N01-02 | Rich scientific descriptions ready for observation tooltips. | `frontend/src/components/science/ScienceExplanation.tsx` |
| **N02-04** | **Scientific Accuracy Audit**<br>Perform final scientific review of application copy, labels, and citations before submission. | N02 Lead | **P1** | N04-03 | Zero scientific ambiguities or false claims present in UI. | `docs/PROJECT_OVERVIEW.md` |

---

## Workstream N03 – Sonification (Audio Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N03-01** | **Frequency Glide & Anti-Click Tuning**<br>Fine-tune exponential frequency ramps in `sonificationService.ts` to ensure seamless gliding without audio clipping. | N03 Lead | **P0** | None | Smooth continuous pitch transitions when scrubbing observations. | `frontend/src/services/sonificationService.ts` |
| **N03-02** | **Harmonic & Timbral Simulation**<br>Implement multi-oscillator overtone synthesis to aurally represent aerosol particle dispersion and turbidity. | N03 Lead | **P1** | N02-02 | Harmonics switch visibly and audibly adds presence based on AOD level. | `frontend/src/services/sonificationService.ts` |
| **N03-03** | **Audio Visualizer Canvas**<br>Add real-time oscilloscope or frequency bar canvas to the `AudioPlayer` component. | N03 Lead | **P1** | N03-01 | Animated waveform canvas reacts to active audio synthesis. | `frontend/src/components/audio/AudioPlayer.tsx` |
| **N03-04** | **Binaural Spatialization (Stretch Goal)**<br>Optional: Map observation coordinates (latitude/longitude) to Web Audio `PannerNode` stereo field. | N03 Lead | **P2** | N03-01 | Sound pans left-to-right corresponding to geographic position. | `frontend/src/services/sonificationService.ts` |

---

## Workstream N04 – Frontend Development (Frontend Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N04-01** | **Backend API Consumer Integration**<br>Wire `dataService.ts` to fetch `/api/v1/observations/aod` with resilient fallback. | N04 Lead | **P0** | N01-03 | Frontend displays live backend data or local fallback transparently. | `frontend/src/services/dataService.ts` |
| **N04-02** | **Auto-Play Timeline Sequence Loop**<br>Add automatic timeline playback mode that steps through timestamps at a user-defined tempo (e.g. 1 step/1.5s). | N04 Lead | **P0** | None | Play button iterates through sequence with synchronized audio. | `frontend/src/components/visualization/Timeline.tsx` |
| **N04-03** | **Observation Comparison Modal**<br>Build comparison drawer to place two observations side-by-side (visuals + dual-tone sonification). | N04 Lead | **P2** | N04-02 | Users can compare two distinct time points simultaneously. | `frontend/src/components/visualization/` |
| **N04-04** | **Mobile Responsiveness & Touch Scrubbing**<br>Optimize timeline touch scrub events and layout for tablets and smartphones. | N04 Lead | **P1** | None | UI renders cleanly across mobile, tablet, and desktop viewports. | `frontend/src/components/` |

---

## Workstream N05 – UI/UX and Storytelling (Creative Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N05-01** | **Atmospheric Visual Asset Collection**<br>Curate high-resolution NASA satellite imagery and icons for `frontend/public/images/`. | N05 Lead | **P0** | None | Assets placed in `public/` directory with proper licensing attribution. | `frontend/public/images/` |
| **N05-02** | **Visual Hierarchy & Glassmorphism Polish**<br>Refine Tailwind classes for glowing atmospheric borders, high-contrast typography, and backdrop blurs. | N05 Lead | **P1** | None | Cohesive, futuristic space agency aesthetic applied across all panels. | `frontend/src/app/globals.css` |
| **N05-03** | **Interactive Guided Onboarding Tour**<br>Create introductory banner or quick-start tooltips guiding first-time judges through the experience. | N05 Lead | **P1** | N04-01 | First-time visitors immediately understand how to listen and explore. | `frontend/src/components/layout/Header.tsx` |
| **N05-04** | **Demo Video & Slide Deck Assets**<br>Produce visual mockups, screenshots, and visual branding for the hackathon submission package. | N05 Lead | **P1** | N05-02 | Assets ready for N06 submission packaging. | `docs/` |

---

## Workstream N06 – Integration, QA and Submission (Integration Lead)

| Task ID | Task Description | Owner | Priority | Dependencies | Acceptance Criteria | Integration Files |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **N06-01** | **Cross-Module Integration Gatekeeper**<br>Review and merge incoming PRs, ensuring interface contracts are preserved and tests pass. | N06 Lead | **P0** | Ongoing | No broken builds, clean Git history, zero unresolved conflicts. | Root configs |
| **N06-02** | **End-to-End Manual Testing Matrix**<br>Execute manual test plan across Chrome, Firefox, Safari, and Edge on desktop and mobile. | N06 Lead | **P0** | N04-02 | Web Audio playback verified on all major browsers without clipping. | `docs/QA_RESULTS.md` |
| **N06-03** | **Submission Checklist & Challenge Alignment**<br>Verify adherence to all NASA Space Apps 2026 rules (open source, data attribution, prompt fit). | N06 Lead | **P0** | All | All requirements satisfied, public repo ready, license included. | `README.md` |
| **N06-04** | **Demo Presentation Script & Video Recording**<br>Coordinate recording of the 30-second / 2-minute project demonstration video for judges. | N06 Lead | **P1** | All | Final video submitted before hackathon submission deadline. | `docs/` |
