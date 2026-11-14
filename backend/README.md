# BREATHE – Python Scientific Backend

> **Technology Stack:** Python 3.12, FastAPI, Pydantic v2, Pandas, Uvicorn  
> **Challenge:** NASA Space Apps Challenge 2026 – The Earth Information Jukebox  
> **Primary Workstream:** N01 (Data Engineering) & N02 (Scientific Research)

---

## 1. Overview & Responsibilities

The `backend/` directory provides scientific data ingestion, preprocessing, validation, and API delivery for the BREATHE experience:
- **NASA Data Ingestion:** Scripts to query NASA Earthdata CMR and GIBS endpoints for atmospheric variables (Aerosol Optical Depth, Carbon Dioxide).
- **Data Preprocessing & Normalization:** Python/Pandas processors that remove invalid fill values (`-9999`), validate physical bounds ($[0.0, 5.0]$), and format timestamps into standardized ISO 8601 UTC.
- **RESTful Scientific API:** Lightweight FastAPI endpoints serving typed datasets to the Next.js Frontend.
- **Scientific Integrity Assurance:** Strict enforcement that Aerosol Optical Depth (AOD) is maintained as dimensionless column optical extinction and never conflated with ground-level Air Quality Index (AQI).

---

## 2. Directory Architecture

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/             # FastAPI routers (/health, /observations)
│   │   ├── schemas/            # Pydantic v2 data models matching docs/DATA_CONTRACT.md
│   │   └── __init__.py
│   ├── services/               # DataService singleton querying processed data
│   ├── processors/             # Pandas processors for NASA observation tabular data
│   ├── data/
│   │   ├── raw/                # Unprocessed NASA granules/files (.csv, .json)
│   │   └── processed/          # Validated, normalized observation datasets
│   ├── models/                 # Domain models
│   ├── utils/                  # Structured logger & helpers
│   ├── main.py                 # FastAPI application root & CORS middleware
│   └── __init__.py
├── tests/                      # Pytest API validation suite
├── scripts/                    # CLI ingestion tools for Workstream N01
├── requirements.txt            # Python dependencies
├── .env.example                # Backend environment configuration
└── README.md
```

---

## 3. Getting Started

### Prerequisites
- Python `3.10+` (Python `3.12.x` recommended)

### Setup & Installation

```bash
# 1. Navigate to the repository root
cd D:\explode\BREATHE-EarthJukebox

# 2. Create and activate a Python virtual environment
python -m venv backend/.venv

# Windows PowerShell:
backend\.venv\Scripts\Activate.ps1
# Or Linux/macOS:
source backend/.venv/bin/activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Configure environment
cp backend/.env.example backend/.env
```

### Running the API Server

You can run the API server using either of the following commands:

**Option 1: From the repository root (Recommended)**
```bash
python -m uvicorn backend.src.main:app --reload --port 8000
# or direct execution:
python backend/src/main.py
```

**Option 2: From inside the `backend/` directory**
```bash
cd backend
python -m uvicorn src.main:app --reload --port 8000
```

- API Base URL: [http://localhost:8000](http://localhost:8000)
- Interactive OpenAPI Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 4. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API discovery and project links |
| `GET` | `/api/v1/health` | Service health status and loaded dataset metadata |
| `GET` | `/api/v1/observations/aod` | Returns complete active Aerosol Optical Depth dataset |
| `GET` | `/api/v1/observations/aod/range` | Returns `{min, max}` bounds for audio sonification |
| `GET` | `/api/v1/observations/aod/{id}` | Returns a single observation record by unique ID |

---

## 5. Running Automated Tests

```bash
# Run backend test suite with pytest
pytest backend/tests
```

---

## 6. Scientific Data Ingestion Workflow (N01)

1. Place raw NASA CSV or JSON extracts into `backend/src/data/raw/`.
2. Run data normalization processor:
   ```bash
   python backend/scripts/fetch_nasa_data.py --variable aod
   ```
3. Processed datasets are automatically validated and written to `backend/src/data/processed/aod_nasa_processed.json`.
4. The running FastAPI service detects the updated file or can be reloaded via `/api/v1/health`.
