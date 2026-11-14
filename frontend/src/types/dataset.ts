import { Observation } from "./observation";

/**
 * Dataset Interface
 * 
 * Represents a collection of chronologically ordered observations for an atmospheric variable.
 * Shared across N01 (Data), N02 (Science), and N04 (Frontend).
 */
export interface Dataset {
  /** Unique dataset identifier (e.g., 'nasa-modis-aod-global') */
  id: string;

  /** Human-readable dataset title */
  title: string;

  /** Data provider / mission / instrument source attribution */
  source: string;

  /** Traceable URL to source dataset or NASA Earthdata catalog */
  sourceUrl: string;

  /** Scientific variable name */
  variable: string;

  /** Measurement unit across all observations */
  unit: string;

  /** Scientific explanation and mission context */
  description: string;

  /** Chronological series of atmospheric observations */
  observations: Observation[];

  /** Flag to indicate if entire dataset contains synthetic/mock observations */
  isMock?: boolean;

  /** Theoretical or observed min/max values across the dataset */
  range?: {
    min: number;
    max: number;
  };
}
