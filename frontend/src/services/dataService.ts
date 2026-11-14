import mockData from "@/data/observations.json";
import { Dataset } from "@/types/dataset";
import { Observation } from "@/types/observation";

/**
 * Data Service (Frontend)
 * 
 * Primary integration boundary for Workstream N01 (Data Engineering) and N04 (Frontend).
 * Manages atmospheric datasets, observation queries, and provenance validation.
 * 
 * Integration Behavior:
 * - When NEXT_PUBLIC_BACKEND_URL is reachable, queries the Python FastAPI Backend.
 * - When Backend is offline or unconfigured, gracefully falls back to local data.
 * - Employs single-flight promise caching to prevent multiple redundant HTTP requests during initialization.
 */
class DataService {
  private currentDataset: Dataset;
  private backendChecked = false;
  private pendingFetchPromise: Promise<Dataset> | null = null;

  constructor() {
    // Initialize with local dataset for immediate offline availability
    this.currentDataset = mockData.dataset as unknown as Dataset;
  }

  /**
   * Retrieves the currently active dataset.
   * Queries FastAPI backend if configured, falling back to local dataset seamlessly.
   * Prevents repeated checks during the same initialization cycle.
   */
  public async getDataset(): Promise<Dataset> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Return in-flight fetch promise if an initialization request is already pending
    if (this.pendingFetchPromise) {
      return this.pendingFetchPromise;
    }

    if (backendUrl && !this.backendChecked && typeof window !== "undefined") {
      this.pendingFetchPromise = (async () => {
        try {
          const response = await fetch(`${backendUrl}/api/v1/observations/aod`, {
            headers: { Accept: "application/json" },
          });

          if (response.ok) {
            const remoteData = (await response.json()) as Dataset;
            if (remoteData && Array.isArray(remoteData.observations)) {
              this.currentDataset = remoteData;
            }
          }
        } catch {
          // Backend offline or unreachable; silently continue with local dataset fallback
        } finally {
          this.backendChecked = true;
          this.pendingFetchPromise = null;
        }
        return this.currentDataset;
      })();

      return this.pendingFetchPromise;
    }

    return Promise.resolve(this.currentDataset);
  }

  /**
   * Resets the backend availability check flag to permit intentional retries or refreshes.
   */
  public resetBackendCheck(): void {
    this.backendChecked = false;
    this.pendingFetchPromise = null;
  }

  /**
   * Retrieves all observations ordered chronologically.
   */
  public async getObservations(): Promise<Observation[]> {
    const dataset = await this.getDataset();
    return [...dataset.observations].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  /**
   * Retrieves a single observation by its unique identifier.
   */
  public async getObservationById(id: string): Promise<Observation | null> {
    const dataset = await this.getDataset();
    const obs = dataset.observations.find((item) => item.id === id);
    return obs || null;
  }

  /**
   * Computes the numeric minimum and maximum values across all current observations.
   * Useful for dynamic chart scaling and sonification normalization.
   */
  public async getDatasetRange(): Promise<{ min: number; max: number }> {
    const dataset = await this.getDataset();
    const obs = dataset.observations;
    if (obs.length === 0) return { min: 0, max: 1 };

    const values = obs.map((o) => o.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max };
  }

  /**
   * Checks whether the current dataset is flagged as development mock data.
   */
  public isMock(): boolean {
    return Boolean(this.currentDataset.isMock);
  }

  /**
   * Integration point for N01: Load verified NASA observations (e.g. from JSON file or API).
   */
  public setDataset(dataset: Dataset): void {
    this.currentDataset = dataset;
  }
}

export const dataService = new DataService();
