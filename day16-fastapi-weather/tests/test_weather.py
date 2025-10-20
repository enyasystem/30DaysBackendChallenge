import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure the project root (one level up from tests/) is on sys.path so we can
# import main.py regardless of how pytest was invoked.
HERE = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, PROJECT_ROOT)

from main import app


@pytest.fixture(autouse=True)
def clear_api_key(monkeypatch):
    # Ensure tests run with no real external API key
    monkeypatch.delenv("OPENWEATHER_API_KEY", raising=False)


def test_weather_happy_path():
    client = TestClient(app)
    r = client.get("/weather", params={"city": "London"})
    assert r.status_code == 200
    data = r.json()
    assert data["city"] == "London"
    assert "temperature_c" in data
    assert data.get("note") == "mocked - no OPENWEATHER_API_KEY"


def test_weather_missing_city():
    client = TestClient(app)
    r = client.get("/weather")
    assert r.status_code == 422
import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure the project root (one level up from tests/) is on sys.path so we can
# import main.py regardless of how pytest was invoked.
HERE = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(HERE, ".."))
sys.path.insert(0, PROJECT_ROOT)

from main import app


@pytest.fixture(autouse=True)
def clear_api_key(monkeypatch):
    # Ensure tests run with no real external API key
    monkeypatch.delenv("OPENWEATHER_API_KEY", raising=False)


def test_weather_happy_path():
    client = TestClient(app)
    r = client.get("/weather", params={"city": "London"})
    assert r.status_code == 200
    data = r.json()
    assert data["city"] == "London"
    assert "temperature_c" in data
    assert data.get("note") == "mocked - no OPENWEATHER_API_KEY"


def test_weather_missing_city():
    client = TestClient(app)
    r = client.get("/weather")
    assert r.status_code == 422
