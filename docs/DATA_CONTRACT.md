# BREATHE – Shared Data Contract

> **Primary Owners:** N01 (Data Engineering) & N02 (Scientific Research)  
> **Status:** Stable Interface Baseline (v2.0.0 - Fullstack Alignment)

---

## 1. Overview & Core Contract Principles

This specification defines the schema for atmospheric observation datasets shared between the **Python FastAPI Backend** and the **Next.js Frontend**. Any ingestion pipeline, Python processor, or API adapter built by Workstream N01 must produce data that strictly conforms to these models.

### Core Scientific Rules
1. **AOD is NOT AQI:** Aerosol Optical Depth (AOD) must never be labeled as Air Quality Index (AQI). AOD is dimensionless and represents total atmospheric column extinction.
2. **Explicit Mock Tagging:** Every synthetic observation or dataset created during development must carry `isMock: true`.
3. **UTC Timestamps:** All timestamps must conform to ISO 8601 UTC formatting (`YYYY-MM-DDTHH:mm:ssZ`).

---

## 2. Schema Definitions (TypeScript & Python)

### A. Observation Schema

#### TypeScript (`frontend/src/types/observation.ts`)
```typescript
export interface Observation {
  id: string;               // Unique observation identifier (e.g. 'nasa-obs-aod-01')
  timestamp: string;        // ISO 8601 formatted UTC timestamp
  imageUrl: string;         // Visual representation URL
  value: number;            // Numeric measurement value
  unit: string;             // Scientific unit ("dimensionless", "ppm", "ppb")
  variable: string;         // Atmospheric variable name
  description: string;      // Scientific description
  isMock?: boolean;         // Explicit mock flag
  coordinates?: {
    lat: number;
    lon: number;
    regionName?: string;
  };
  provenance?: {
    satellite?: string;     // e.g. "Terra / Aqua", "Suomi NPP"
    instrument?: string;    // e.g. "MODIS", "VIIRS"
    processingLevel?: string;
    citationUrl?: string;
  };
}
```

#### Python Pydantic v2 (`backend/src/api/schemas/observation_schema.py`)
```python
class CoordinatesSchema(BaseModel):
    lat: float
    lon: float
    regionName: Optional[str] = None

class ProvenanceSchema(BaseModel):
    satellite: Optional[str] = None
    instrument: Optional[str] = None
    processingLevel: Optional[str] = None
    citationUrl: Optional[str] = None

class ObservationSchema(BaseModel):
    id: str
    timestamp: str
    imageUrl: str
    value: float
    unit: str
    variable: str
    description: str
    isMock: Optional[bool] = False
    coordinates: Optional[CoordinatesSchema] = None
    provenance: Optional[ProvenanceSchema] = None
```

---

### B. Dataset Schema

#### TypeScript (`frontend/src/types/dataset.ts`)
```typescript
export interface Dataset {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  variable: string;
  unit: string;
  description: string;
  observations: Observation[];
  isMock?: boolean;
  range?: {
    min: number;
    max: number;
  };
}
```

#### Python Pydantic v2 (`backend/src/api/schemas/observation_schema.py`)
```python
class DatasetRangeSchema(BaseModel):
    min: float
    max: float

class DatasetSchema(BaseModel):
    id: str
    title: str
    source: str
    sourceUrl: str
    variable: str
    unit: str
    description: str
    observations: List[ObservationSchema]
    isMock: Optional[bool] = False
    range: Optional[DatasetRangeSchema] = None
```

---

## 3. Atmospheric Variables & Unit Standards

| Variable Name | Unit String | Expected Range | Instrument / Mission | Scientific Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Aerosol Optical Depth (AOD at 550nm)** | `dimensionless` | `0.00 – 3.00+` | MODIS (Terra/Aqua), VIIRS (Suomi NPP) | Total column light attenuation by suspended particles. |
| **Carbon Dioxide (CO2)** | `ppm` | `380 – 430` | OCO-2, OCO-3 | Column-averaged dry-air mole fraction of atmospheric CO2 ($X_{CO2}$). |
| **Methane (CH4)** | `ppb` | `1800 – 2100` | TROPOMI, EMIT | Atmospheric methane column concentration. |

---

## 4. API Endpoints Contract

The Backend exposes the following endpoints conforming to this contract:

- `GET /api/v1/observations/aod`: Returns `DatasetSchema` / `Dataset`.
- `GET /api/v1/observations/aod/range`: Returns `DatasetRangeSchema` (`{ "min": float, "max": float }`).
- `GET /api/v1/observations/aod/{observation_id}`: Returns single `ObservationSchema` / `Observation`.
