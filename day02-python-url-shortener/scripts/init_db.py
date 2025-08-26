"""
Initialize the database tables for local development.

For production or more advanced schema changes, use Flask-Migrate (alembic).
"""
"""
Initialize the database tables for local development.

This script is safe to run from the project root or from the scripts/ folder.
It ensures the project root is on sys.path so imports like `from app import create_app`
work as expected.
"""
import sys
from pathlib import Path

# Make sure the project root is on sys.path so imports succeed when this
# script is executed from inside the scripts/ directory.
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app import create_app
from models import db


def main() -> None:
    app = create_app()

    with app.app_context():
        db.create_all()
        print("Database created (or already exists).")


if __name__ == "__main__":
    main()
