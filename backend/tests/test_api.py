import pytest
from fastapi.testclient import TestClient
from backend.src.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify root discovery endpoint responds with project metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "BREATHE"
    assert "health" in data
    assert "observations" in data


def test_health_endpoint():
    """Verify healthcheck endpoint reports healthy status and loaded dataset."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["dataset_loaded"] is True
    assert data["observations_count"] > 0


def test_get_aod_dataset():
    """Verify AOD dataset endpoint conforms to shared schema and scientific rules."""
    response = client.get("/api/v1/observations/aod")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "observations" in data
    assert len(data["observations"]) > 0

    # Scientific integrity check: AOD must not be presented as AQI
    assert "Air Quality Index" not in data["unit"]
    assert "dimensionless" in data["unit"].lower()

    # S-01 check: Prototype mock dataset must be explicitly flagged
    assert data.get("isMock") is True


def test_get_aod_range():
    """Verify numeric range endpoint returns valid min/max bounds."""
    response = client.get("/api/v1/observations/aod/range")
    assert response.status_code == 200
    data = response.json()
    assert "min" in data
    assert "max" in data
    assert data["min"] <= data["max"]
    assert data["min"] >= 0.0


def test_get_single_observation_success():
    """Verify single observation retrieval by valid ID."""
    # First get the dataset to extract an authentic ID
    dataset_resp = client.get("/api/v1/observations/aod")
    assert dataset_resp.status_code == 200
    first_obs = dataset_resp.json()["observations"][0]
    obs_id = first_obs["id"]

    response = client.get(f"/api/v1/observations/aod/{obs_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == obs_id
    assert data["value"] == first_obs["value"]
    assert data["unit"] == first_obs["unit"]
    assert data.get("isMock") is True


def test_get_single_observation_not_found():
    """Verify single observation retrieval returns HTTP 404 for unknown ID."""
    response = client.get("/api/v1/observations/aod/nonexistent-granule-id-9999")
    assert response.status_code == 404
    error_data = response.json()
    assert "detail" in error_data
    assert "not found" in error_data["detail"].lower()


def test_unknown_route_returns_404():
    """Verify unknown API route returns standard HTTP 404 with detail object."""
    response = client.get("/api/v1/invalid-unmapped-route")
    assert response.status_code == 404
    error_data = response.json()
    assert "detail" in error_data


def test_observation_mock_flags_consistent():
    """Verify that every observation in the dataset is explicitly flagged with isMock=True."""
    response = client.get("/api/v1/observations/aod")
    assert response.status_code == 200
    observations = response.json()["observations"]
    for obs in observations:
        assert obs["isMock"] is True, f"Observation {obs['id']} failed to flag isMock=True"
