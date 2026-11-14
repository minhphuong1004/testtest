from .health import router as health_router
from .observations import router as observations_router

__all__ = ["health_router", "observations_router"]
