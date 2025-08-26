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

def test_redirect_increments_clicks(client):
    resp = client.post('/shorten', json={"url": "https://example.org"})
    assert resp.status_code == 201
    code = resp.get_json()["code"]

    # test redirect response (302)
    r = client.get(f'/{code}', follow_redirects=False)
    assert r.status_code == 302
    assert r.headers["Location"] == "https://example.org"

    # clicks incremented
    info = client.get(f'/api/info/{code}')
    assert info.status_code == 200
    assert info.get_json()["clicks"] >= 1
