from pathlib import Path
from typing import Optional, List, Dict
from ..api.schemas.observation_schema import DatasetSchema, ObservationSchema, DatasetRangeSchema
from ..processors.nasa_aod_processor import NasaAodProcessor
from ..utils.logger import logger


class DataService:
    """
    Backend service managing scientific datasets, queries, and range calculations.
    Serves data to FastAPI routes.
    """

    def __init__(self, dataset_path: Optional[Path] = None):
        if dataset_path is None:
            dataset_path = Path(__file__).resolve().parent.parent / "data" / "processed" / "aod_nasa_processed.json"
        self.dataset_path = dataset_path
        self._dataset: Optional[DatasetSchema] = None
        self._load_dataset()

    def _load_dataset(self) -> None:
        """Loads and caches active dataset into memory."""
        self._dataset = NasaAodProcessor.load_processed_dataset(self.dataset_path)
        if self._dataset:
            logger.info(f"Loaded dataset '{self._dataset.id}' with {len(self._dataset.observations)} observations.")
        else:
            logger.warning(f"Could not load dataset from {self.dataset_path}.")

    def get_dataset(self) -> Optional[DatasetSchema]:
        """Returns the full active dataset."""
        return self._dataset

    def get_observations(self) -> List[ObservationSchema]:
        """Returns chronological list of observations."""
        if not self._dataset:
            return []
        return sorted(self._dataset.observations, key=lambda o: o.timestamp)

    def get_observation_by_id(self, obs_id: str) -> Optional[ObservationSchema]:
        """Finds a single observation by its unique ID."""
        if not self._dataset:
            return None
        for obs in self._dataset.observations:
            if obs.id == obs_id:
                return obs
        return None

    def get_range(self) -> DatasetRangeSchema:
        """Calculates minimum and maximum values across observations for sonification normalization."""
        if not self._dataset or not self._dataset.observations:
            return DatasetRangeSchema(min=0.0, max=1.0)
        values = [o.value for o in self._dataset.observations]
        return DatasetRangeSchema(min=min(values), max=max(values))

    def reload(self) -> None:
        """Reloads dataset from disk (useful after data ingestion pipeline runs)."""
        self._load_dataset()


backend_data_service = DataService()
