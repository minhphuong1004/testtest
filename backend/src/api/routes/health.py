from datetime import datetime, timezone
from fastapi import APIRouter
from ...services.data_service import backend_data_service

router = APIRouter(tags=["Health"])


@router.get("/health")
def healthcheck():
    """System health check and dataset readiness endpoint."""
    dataset = backend_data_service.get_dataset()
    return {
        "status": "healthy",
        "service": "BREATHE Backend API",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dataset_loaded": dataset is not None,
        "observations_count": len(dataset.observations) if dataset else 0,
        "active_variable": dataset.variable if dataset else None,
    }
