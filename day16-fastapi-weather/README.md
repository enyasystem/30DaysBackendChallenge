# Day 16 — FastAPI Weather (Proxy + Mock)

Simple FastAPI service that returns current weather for a city. If an
OpenWeatherMap API key is set via `OPENWEATHER_API_KEY` the service will
proxy requests to the real API; otherwise it returns mocked data for
local development and testing.

Quick start

Install dependencies (recommended inside a virtualenv):

```bash
cd day16-fastapi-weather
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Run tests:

```bash
pytest -q
```

.env example

Create a `.env` file with this content if you want real data:

```env
OPENWEATHER_API_KEY=your_api_key_here
```
