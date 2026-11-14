/**
 * Observation Interface
 * 
 * Represents a single atmospheric data measurement at a specific point in time and space.
 * Shared across Data Engineering (N01), Scientific Research (N02), Sonification (N03), and Frontend (N04).
 * 
 * Note on Scientific Accuracy:
 * Aerosol Optical Depth (AOD) is dimensionless and must NEVER be labeled as AQI (Air Quality Index).
 */
export interface Observation {
  /** Unique observation identifier (e.g., 'obs-aod-2026-08-01-mock') */
  id: string;

  /** ISO 8601 formatted UTC timestamp (e.g., '2026-08-01T12:00:00Z') */
  timestamp: string;

  /** Visual representation URL (satellite composite, heat map layer, or placeholder) */
  imageUrl: string;

  /** Numeric measurement value */
  value: number;

  /** Scientific unit of measurement (e.g., 'dimensionless', 'ppm', 'ppb', 'K') */
  unit: string;

  /** Atmospheric variable name (e.g., 'Aerosol Optical Depth (AOD 550nm)', 'Carbon Dioxide (CO2)') */
  variable: string;

  /** Scientific description and context for this observation */
  description: string;

  /** Explicit flag indicating whether this is development mock data */
  isMock?: boolean;

  /** Optional geographic bounding or center point */
  coordinates?: {
    lat: number;
    lon: number;
    regionName?: string;
  };

  /** Provenance metadata when verified NASA data is used */
  provenance?: {
    satellite?: string; // e.g. "Terra / Aqua", "Sentinel-5P", "OCO-2/3"
    instrument?: string; // e.g. "MODIS", "VIIRS", "TROPOMI"
    processingLevel?: string; // e.g. "Level 3 Daily Global"
    citationUrl?: string;
  };
}
