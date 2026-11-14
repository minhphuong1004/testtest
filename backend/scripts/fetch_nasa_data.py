#!/usr/bin/env python3
"""
BREATHE – NASA Earth Observation Ingestion & Discovery Pipeline
Workstream N01: Data Engineering

This script interfaces with the NASA Earthdata Common Metadata Repository (CMR) API
to discover and retrieve authentic satellite observation granules for atmospheric sonification.

NASA Collection Reference:
-------------------------
Collection Short Name : MOD08_D3
Long Name             : MODIS/Terra Aerosol Cloud Water Vapor Daily L3 Global 1Deg CMG
Version               : 6.1 (Collection Concept ID: C1443528505-LAADS)
Instrument / Platform : MODIS aboard Terra (EOS AM-1) & Aqua (EOS PM-1)
Variable Target       : Aerosol Optical Depth (AOD) at 550 nm (Column optical thickness)
Physical Unit         : Dimensionless (Optical Depth) - NEVER conflate with AQI.
Temporal Coverage     : 2000-02-24 to Present (Daily granules)
Spatial Coverage      : Global (-180.0, -90.0, 180.0, 90.0)

Authentication Note:
--------------------
Metadata discovery via the NASA CMR search API is public (no credentials required).
Direct downloading of raw data granules from NASA DAACs (e.g. LAADS DAAC, Earthdata Cloud)
requires NASA Earthdata Login credentials (URS):
- Set environment variable NASA_EARTHDATA_TOKEN or
- Set NASA_EARTHDATA_USERNAME and NASA_EARTHDATA_PASSWORD.
Register for free at: https://urs.earthdata.nasa.gov/

Scientific File Format Notice:
------------------------------
NASA MODIS Level-3 daily granules are distributed in HDF4 / HDF-EOS2 or NetCDF-4 format (.hdf, .nc).
Extracting grid arrays from raw HDF binaries requires specialized C-extensions (pyhdf, h5py, or netCDF4).
This script performs verified metadata discovery and authenticated granule retrieval, writing
raw files to `backend/src/data/raw/` without fabricating numerical measurements.
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
import requests

# Add project root to path for local module imports
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.src.processors.nasa_aod_processor import NasaAodProcessor
from backend.src.utils.logger import logger

# NASA CMR API Endpoint
CMR_GRANULES_ENDPOINT = "https://cmr.earthdata.nasa.gov/search/granules.json"


def query_nasa_cmr(
    short_name: str = "MOD08_D3",
    temporal: Optional[str] = None,
    bounding_box: Optional[str] = None,
    page_size: int = 10,
    max_granules: int = 20,
) -> List[Dict[str, Any]]:
    """
    Queries the NASA Earthdata CMR API for granules matching the given parameters.
    
    Args:
        short_name: NASA collection short name (e.g., 'MOD08_D3' or 'MYD08_D3').
        temporal: ISO 8601 date range 'START_DATE,END_DATE' (e.g., '2024-07-01T00:00:00Z,2024-07-05T23:59:59Z').
        bounding_box: Coordinate bounding box 'lon_min,lat_min,lon_max,lat_max'.
        page_size: Number of records per page.
        max_granules: Maximum number of granules to discover.

    Returns:
        List of parsed granule metadata dictionaries.
    """
    logger.info(f"Querying NASA CMR API for collection '{short_name}'...")
    params: Dict[str, Any] = {
        "short_name": short_name,
        "page_size": min(page_size, 100),
        "sort_key[]": "-start_date",
    }

    if temporal:
        params["temporal"] = temporal
        logger.info(f"Temporal filter applied: {temporal}")

    if bounding_box:
        params["bounding_box"] = bounding_box
        logger.info(f"Bounding box applied: {bounding_box}")

    headers = {
        "Accept": "application/json",
        "User-Agent": "BREATHE-NASA-SpaceApps-2026/1.0",
    }

    token = os.environ.get("NASA_EARTHDATA_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    try:
        response = requests.get(CMR_GRANULES_ENDPOINT, params=params, headers=headers, timeout=25)
    except requests.exceptions.Timeout:
        logger.error("Request to NASA CMR API timed out (>25s). Check network connectivity.")
        raise
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error querying NASA CMR API: {e}")
        raise

    if response.status_code != 200:
        logger.error(f"NASA CMR returned HTTP {response.status_code}: {response.text[:300]}")
        raise RuntimeError(f"NASA CMR API error: HTTP {response.status_code}")

    data = response.json()
    feed = data.get("feed", {})
    entries = feed.get("entry", [])
    total_hits = feed.get("hits", 0)

    logger.info(f"NASA CMR reports {total_hits} total matching granules. Retrieved {len(entries)} entries.")

    granules: List[Dict[str, Any]] = []
    for entry in entries[:max_granules]:
        title = entry.get("title", "")
        time_start = entry.get("time_start", "")
        time_end = entry.get("time_end", "")
        granule_size_mb = entry.get("granule_size")

        # Extract direct download URLs from entry links
        download_urls: List[str] = []
        for link in entry.get("links", []):
            href = link.get("href", "")
            rel = link.get("rel", "")
            # Look for HTTP/HTTPS data links
            if href.startswith("http") and ("data#" in rel or href.endswith((".hdf", ".nc", ".h5"))):
                download_urls.append(href)

        granules.append({
            "id": entry.get("id"),
            "granule_ur": entry.get("producer_granule_id", title),
            "title": title,
            "collection": short_name,
            "time_start": time_start,
            "time_end": time_end,
            "size_mb": granule_size_mb,
            "download_urls": download_urls,
            "archive_center": entry.get("archive_center", "NASA LAADS DAAC"),
        })

    return granules


def download_granule_file(
    url: str,
    output_directory: Path,
    auth_token: Optional[str] = None,
    username: Optional[str] = None,
    password: Optional[str] = None,
) -> Path:
    """
    Downloads a raw NASA data granule file to disk.
    
    Args:
        url: Direct NASA data download URL.
        output_directory: Destination directory (backend/src/data/raw/).
        auth_token: NASA Earthdata Bearer Token.
        username: NASA URS username.
        password: NASA URS password.

    Returns:
        Path to downloaded file.
    """
    filename = url.split("/")[-1].split("?")[0]
    output_path = output_directory / filename

    logger.info(f"Downloading NASA granule: {filename} from {url}...")

    headers = {
        "User-Agent": "BREATHE-NASA-SpaceApps-2026/1.0",
    }
    auth = None

    if auth_token:
        headers["Authorization"] = f"Bearer {auth_token}"
    elif username and password:
        auth = (username, password)

    try:
        response = requests.get(url, headers=headers, auth=auth, stream=True, timeout=60)
        # NASA URS redirects to oauth endpoint if unauthenticated
        if response.status_code == 401 or "urs.earthdata.nasa.gov" in response.url and response.status_code != 200:
            logger.error(
                "Authentication required. NASA Earthdata returned HTTP 401/Redirect. "
                "Set NASA_EARTHDATA_USERNAME and NASA_EARTHDATA_PASSWORD in backend/.env"
            )
            raise PermissionError("NASA Earthdata authentication required for raw file download.")

        response.raise_for_status()

        output_directory.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=65536):
                if chunk:
                    f.write(chunk)

        file_size = output_path.stat().st_size
        if file_size == 0:
            output_path.unlink(missing_ok=True)
            raise RuntimeError(f"Downloaded file {filename} is empty (0 bytes).")

        logger.info(f"Successfully downloaded {filename} ({file_size / (1024 * 1024):.2f} MB) to {output_path}")
        return output_path

    except Exception as e:
        logger.error(f"Failed to download granule from {url}: {e}")
        if output_path.exists():
            output_path.unlink(missing_ok=True)
        raise


def save_granule_manifest(granules: List[Dict[str, Any]], output_path: Path) -> None:
    """Saves discovered NASA CMR granule metadata to a verifiable JSON manifest."""
    manifest = {
        "_meta": {
            "retrieval_timestamp": datetime.now(timezone.utc).isoformat(),
            "pipeline": "BREATHE NASA CMR Discovery Pipeline",
            "source": "NASA Earthdata Common Metadata Repository (CMR)",
            "api_endpoint": CMR_GRANULES_ENDPOINT,
            "total_discovered": len(granules),
            "scientific_note": "AOD at 550nm represents total column aerosol light extinction (dimensionless).",
        },
        "granules": granules,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    logger.info(f"Saved NASA granule manifest with {len(granules)} records to: {output_path}")


def main():
    parser = argparse.ArgumentParser(
        description="BREATHE - NASA Earth Observation Ingestion & Discovery Pipeline."
    )
    parser.add_argument(
        "--collection",
        default="MOD08_D3",
        help="NASA Collection Short Name (e.g. 'MOD08_D3' for Terra L3 Daily AOD, 'MYD08_D3' for Aqua).",
    )
    parser.add_argument(
        "--temporal",
        default="2024-07-01T00:00:00Z,2024-07-05T23:59:59Z",
        help="ISO 8601 Date Range: 'START_DATE,END_DATE' (UTC).",
    )
    parser.add_argument(
        "--bounding-box",
        default="-180.0,-90.0,180.0,90.0",
        help="Spatial bounding box: 'min_lon,min_lat,max_lon,max_lat'.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=6,
        help="Maximum number of granules to discover/download.",
    )
    parser.add_argument(
        "--download",
        action="store_true",
        help="Attempt actual download of granule files to backend/src/data/raw/ (requires Earthdata credentials).",
    )
    parser.add_argument(
        "--verify-local",
        default="backend/src/data/processed/aod_nasa_processed.json",
        help="Verify existing local processed JSON dataset against schema.",
    )
    args = parser.parse_args()

    # Mode 1: Verify existing local processed dataset
    if args.verify_local and not args.download and not sys.argv[1:]:
        local_path = PROJECT_ROOT / args.verify_local
        logger.info(f"Verifying local processed dataset at {local_path}...")
        if local_path.exists():
            dataset = NasaAodProcessor.load_processed_dataset(local_path)
            if dataset:
                logger.info(f"Dataset '{dataset.id}' verified successfully: {len(dataset.observations)} observations.")
                logger.info(f"Variable: {dataset.variable} | Unit: {dataset.unit} | isMock: {dataset.isMock}")
                sys.exit(0)
            else:
                logger.error("Dataset verification failed against Pydantic schema.")
                sys.exit(1)
        else:
            logger.warning(f"File {local_path} does not exist.")

    # Mode 2: NASA CMR Live Discovery
    logger.info("Executing NASA CMR metadata discovery...")
    try:
        granules = query_nasa_cmr(
            short_name=args.collection,
            temporal=args.temporal,
            bounding_box=args.bounding_box,
            max_granules=args.limit,
        )
    except Exception as e:
        logger.error(f"NASA CMR metadata discovery pipeline failed: {e}")
        sys.exit(1)

    if not granules:
        logger.warning("No granules discovered matching criteria. Exiting.")
        sys.exit(0)

    # Save discovery manifest to raw data directory
    manifest_path = PROJECT_ROOT / "backend" / "src" / "data" / "raw" / "cmr_granules_manifest.json"
    save_granule_manifest(granules, manifest_path)

    # Mode 3: Optional Granule Download
    if args.download:
        raw_dir = PROJECT_ROOT / "backend" / "src" / "data" / "raw"
        token = os.environ.get("NASA_EARTHDATA_TOKEN")
        username = os.environ.get("NASA_EARTHDATA_USERNAME")
        password = os.environ.get("NASA_EARTHDATA_PASSWORD")

        if not token and not (username and password):
            logger.warning(
                "No NASA Earthdata credentials found in environment. "
                "Download will attempt public anonymous access, which may require URS login."
            )

        downloaded_count = 0
        for g in granules:
            urls = g.get("download_urls", [])
            if not urls:
                logger.warning(f"Granule {g['title']} has no direct HTTP download URLs listed in CMR metadata.")
                continue

            target_url = urls[0]
            try:
                download_granule_file(target_url, raw_dir, auth_token=token, username=username, password=password)
                downloaded_count += 1
            except PermissionError:
                logger.error("Authentication required for NASA DAAC downloads. Halting download pipeline.")
                sys.exit(1)
            except Exception as e:
                logger.error(f"Download failed for {target_url}: {e}")
                sys.exit(1)

        logger.info(f"Pipeline complete. Successfully downloaded {downloaded_count} granules to {raw_dir}.")
    else:
        logger.info(
            "Discovery complete. To download raw granules, set NASA Earthdata credentials in backend/.env "
            "and run with --download flag."
        )


if __name__ == "__main__":
    main()
