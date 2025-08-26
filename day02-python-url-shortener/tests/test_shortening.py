"""
Integration-style tests using Flask test client and an in-memory SQLite DB.

These tests focus on the public API contract and can run quickly.
"""
import pytest
from app import create_app
from models import db

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()
        yield app.test_client()

def test_shorten_and_info(client):
    # create short URL
    resp = client.post('/shorten', json={"url": "https://example.com"})
    assert resp.status_code == 201
    data = resp.get_json()
    assert "code" in data and "short_url" in data

    # info endpoint
    code = data["code"]
    info = client.get(f'/api/info/{code}')
    assert info.status_code == 200
    info_json = info.get_json()
    assert info_json["original_url"] == "https://example.com"
