from typing import List, Optional
from pydantic import BaseModel, Field


class CoordinatesSchema(BaseModel):
    """Geospatial coordinates for an atmospheric observation."""
    lat: float = Field(..., description="Latitude in decimal degrees (-90.0 to 90.0)")
    lon: float = Field(..., description="Longitude in decimal degrees (-180.0 to 180.0)")
    regionName: Optional[str] = Field(None, description="Human-readable geographical region name")


class ProvenanceSchema(BaseModel):
    """Provenance and satellite mission metadata for verified NASA observations."""
    satellite: Optional[str] = Field(None, description="Satellite platform (e.g. 'Terra / Aqua', 'Suomi NPP')")
    instrument: Optional[str] = Field(None, description="Remote sensing instrument (e.g. 'MODIS', 'VIIRS')")
    processingLevel: Optional[str] = Field(None, description="Data processing level (e.g. 'Level 3 Daily Global')")
    citationUrl: Optional[str] = Field(None, description="Canonical citation or Earthdata catalog URL")


class ObservationSchema(BaseModel):
    """
    Observation Data Model.
    Strictly conforms to docs/DATA_CONTRACT.md and frontend Observation interface.
    """
    id: str = Field(..., description="Unique observation identifier")
    timestamp: str = Field(..., description="ISO 8601 formatted UTC timestamp (YYYY-MM-DDTHH:mm:ssZ)")
    imageUrl: str = Field(..., description="Satellite visualization or composite imagery URL")
    value: float = Field(..., description="Physical measurement value (e.g. column AOD optical extinction)")
    unit: str = Field(..., description="Measurement unit (e.g. 'dimensionless' for AOD, 'ppm' for CO2)")
    variable: str = Field(..., description="Scientific variable name")
    description: str = Field(..., description="Physical description and atmospheric context")
    isMock: Optional[bool] = Field(False, description="Flag indicating if observation is synthetic prototype data")
    coordinates: Optional[CoordinatesSchema] = None
    provenance: Optional[ProvenanceSchema] = None


class DatasetRangeSchema(BaseModel):
    """Minimum and maximum measurement bounds across a dataset."""
    min: float = Field(..., description="Minimum measurement value")
    max: float = Field(..., description="Maximum measurement value")


class DatasetSchema(BaseModel):
    """
    Complete atmospheric observation dataset payload.
    Served to the Frontend over /api/v1/observations/aod.
    """
    id: str = Field(..., description="Unique dataset identifier")
    title: str = Field(..., description="Human-readable dataset title")
    source: str = Field(..., description="Data provider / mission source attribution")
    sourceUrl: str = Field(..., description="Traceable URL to source catalog or NASA Earthdata")
    variable: str = Field(..., description="Scientific variable name")
    unit: str = Field(..., description="Scientific unit across all observations")
    description: str = Field(..., description="Scientific summary and mission context")
    observations: List[ObservationSchema] = Field(..., description="Chronological series of observations")
    isMock: Optional[bool] = Field(False, description="Flag indicating whether entire dataset is synthetic")
    range: Optional[DatasetRangeSchema] = None
