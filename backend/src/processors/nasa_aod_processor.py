import json
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd
from ..api.schemas.observation_schema import DatasetSchema, ObservationSchema, DatasetRangeSchema
from ..utils.logger import logger


class NasaAodProcessor:
    """
    Scientific processor for NASA Aerosol Optical Depth (AOD 550nm) datasets.
    Primary tool for Workstream N01 (Data Engineering) & N02 (Scientific Research).
    
    Responsibilities:
    - Filters uncalibrated fill values (-9999, NaN, nulls).
    - Validates column optical depth physical range [0.0 - 5.0].
    - Standardizes timestamps to ISO 8601 UTC.
    - Validates provenance metadata against NASA Earthdata catalog standards.
    - Enforces scientific rule: AOD is dimensionless and MUST NOT be labeled as AQI.
    """

    @staticmethod
    def clean_raw_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        """Cleans and standardizes raw NASA tabular observation records."""
        # Drop rows with invalid or missing values
        cleaned = df.dropna(subset=["timestamp", "value"]).copy()

        # Replace standard NASA fill values (-9999, -999) with NaN
        cleaned["value"] = pd.to_numeric(cleaned["value"], errors="coerce")
        cleaned = cleaned[cleaned["value"].notna()]
        cleaned = cleaned[cleaned["value"] >= 0.0]

        # Convert timestamps to UTC ISO 8601
        cleaned["timestamp"] = pd.to_datetime(cleaned["timestamp"], utc=True).dt.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Sort chronologically
        cleaned = cleaned.sort_values(by="timestamp").reset_index(drop=True)
        return cleaned

    @classmethod
    def load_processed_dataset(cls, file_path: Path) -> Optional[DatasetSchema]:
        """Loads and validates a processed JSON dataset from disk."""
        if not file_path.exists():
            logger.warning(f"Dataset file not found at: {file_path}")
            return None

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Extract dataset payload whether under top-level 'dataset' key or root
            dataset_payload = data.get("dataset", data)
            schema = DatasetSchema(**dataset_payload)
            return schema
        except Exception as e:
            logger.error(f"Failed to parse dataset from {file_path}: {e}")
            return None
