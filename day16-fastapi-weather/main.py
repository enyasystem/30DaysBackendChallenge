from fastapi import FastAPI, HTTPException, Query
from dotenv import load_dotenv
load_dotenv()   # reads .env into environment variables for the process
import os
import requests

app = FastAPI(title="Day 16 - FastAPI Weather")


@app.get("/weather")
def get_weather(city: str = Query(..., min_length=1)):
    """Return current weather for `city`.

    - If `OPENWEATHER_API_KEY` is set in the environment, the endpoint will
      proxy the request to OpenWeatherMap and return a simplified payload.
    - Otherwise it returns mocked sample data so the service works offline
      and in tests.
    """
    key = os.getenv("OPENWEATHER_API_KEY", "").strip()
    if key:
        try:
            resp = requests.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": city, "appid": key, "units": "metric"},
                timeout=6,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "city": data.get("name"),
                "temperature_c": data.get("main", {}).get("temp"),
                "description": data.get("weather", [{}])[0].get("description"),
            }
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Upstream weather API error")
    # Mocked response when no API key is provided (good for local dev & tests)
    return {"city": city, "temperature_c": 20.0, "description": "clear sky", "note": "mocked - no OPENWEATHER_API_KEY"}
from fastapi import FastAPI, HTTPException, Query
from dotenv import load_dotenv
load_dotenv()   # reads .env into environment variables for the process
import os
import requests

app = FastAPI(title="Day 16 - FastAPI Weather")


@app.get("/weather")
def get_weather(city: str = Query(..., min_length=1)):
    """Return current weather for `city`.

    - If `OPENWEATHER_API_KEY` is set in the environment, the endpoint will
      proxy the request to OpenWeatherMap and return a simplified payload.
    - Otherwise it returns mocked sample data so the service works offline
      and in tests.
    """
    key = os.getenv("OPENWEATHER_API_KEY", "").strip()
    if key:
        try:
            resp = requests.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": city, "appid": key, "units": "metric"},
                timeout=6,
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "city": data.get("name"),
                "temperature_c": data.get("main", {}).get("temp"),
                "description": data.get("weather", [{}])[0].get("description"),
            }
        except requests.RequestException:
            raise HTTPException(status_code=502, detail="Upstream weather API error")
    # Mocked response when no API key is provided (good for local dev & tests)
    return {"city": city, "temperature_c": 20.0, "description": "clear sky", "note": "mocked - no OPENWEATHER_API_KEY"}
