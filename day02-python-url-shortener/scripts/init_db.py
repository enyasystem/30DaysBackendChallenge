"""
Initialize the database tables for local development.

For production or more advanced schema changes, use Flask-Migrate (alembic).
"""
from app import create_app
from models import db

app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created (or already existed).")
