"""Database model definitions and db instance."""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# single db instance used across the app
db = SQLAlchemy()

class Url(db.Model):
    """
    Url model represents a shortened URL entry.
    Fields:
      - code: short, unique identifier used in redirects
      - original_url: the target URL
      - created_at: UTC timestamp when created
      - expires_at: optional UTC expiry timestamp
      - clicks: integer click counter
    """
    __tablename__ = "urls"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(64), unique=True, nullable=False, index=True)
    original_url = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=True)
    clicks = db.Column(db.Integer, default=0, nullable=False)

    def __repr__(self):
        return f"<Url code={self.code} original_url={self.original_url[:40]!r}>"

    def to_dict(self, base_url: str | None = None) -> dict:
        """
        Return a JSON-serializable dict for API responses.
        base_url - if provided, constructs short_url.
        """
        data = {
            "code": self.code,
            "original_url": self.original_url,
            "created_at": self.created_at.isoformat() + "Z",
            "expires_at": self.expires_at.isoformat() + "Z" if self.expires_at else None,
            "clicks": self.clicks,
        }
        if base_url:
            data["short_url"] = f"{base_url.rstrip('/')}/{self.code}"
        return data
