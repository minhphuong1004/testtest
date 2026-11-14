from typing import List
from fastapi import APIRouter, HTTPException, Path
from ..schemas.observation_schema import DatasetSchema, ObservationSchema, DatasetRangeSchema
from ...services.data_service import backend_data_service

router = APIRouter(prefix="/observations", tags=["Observations"])


@router.get("/aod", response_model=DatasetSchema)
def get_aod_dataset():
    """
    Returns the complete active Aerosol Optical Depth (AOD 550nm) dataset.
    Consumed by Frontend page controller and DataService.
    """
    dataset = backend_data_service.get_dataset()
    if not dataset:
        raise HTTPException(status_code=503, detail="Active atmospheric dataset is not yet loaded.")
    return dataset


@router.get("/aod/range", response_model=DatasetRangeSchema)
def get_aod_range():
    """
    Returns numeric min and max bounds for sonification normalization and visual chart scales.
    """
    return backend_data_service.get_range()


@router.get("/aod/{observation_id}", response_model=ObservationSchema)
def get_observation_by_id(
    observation_id: str = Path(..., description="Unique observation ID (e.g. 'nasa-obs-aod-01')")
):
    """
    Retrieves a single atmospheric observation record by its ID.
    """
    obs = backend_data_service.get_observation_by_id(observation_id)
    if not obs:
        raise HTTPException(
            status_code=404,
            detail=f"Observation with ID '{observation_id}' not found in current dataset."
        )
    return obs
