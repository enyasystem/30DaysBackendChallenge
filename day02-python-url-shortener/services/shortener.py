"""
Business logic for the URL shortener.

This module keeps core operations separate from HTTP code, making it easier
to test and maintain. Functions are documented and intentionally minimal.
"""
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional

from validators import url as validate_url
from models import Url, db

# Character set for short codes (safe for URLs)
BASE62 = string.ascii_letters + string.digits

class ShortenerError(Exception):
    """Base service error."""
    pass

class InvalidURLError(ShortenerError):
    pass

class GenerationError(ShortenerError):
    pass

def _generate_code(length: int = 6) -> str:
    """Securely generate a random code of given length using secrets."""
    return ''.join(secrets.choice(BASE62) for _ in range(length))

def create_short_url(original_url: str, expiry_days: Optional[int] = None, code_length: int = 6, max_attempts: int = 8) -> Url:
    """
    Create and persist a shortened URL.

    - Validates the URL.
    - Optionally deduplicates (returns existing non-expired entry).
    - Tries `max_attempts` to produce a unique code.
    """
    if not isinstance(original_url, str) or not validate_url(original_url):
        raise InvalidURLError("Invalid URL provided")

    expires_at = None
    if expiry_days:
        expires_at = datetime.utcnow() + timedelta(days=int(expiry_days))

    # Optional dedupe: return existing non-expired record for same original URL
    existing = Url.query.filter_by(original_url=original_url).first()
    if existing and (existing.expires_at is None or existing.expires_at > datetime.utcnow()):
        return existing

    # Try generating a unique code with limited retries
    for attempt in range(max_attempts):
        code = _generate_code(length=code_length)
        if not Url.query.filter_by(code=code).first():
            # create and persist
            new_url = Url(code=code, original_url=original_url, expires_at=expires_at)
            db.session.add(new_url)
            try:
                db.session.commit()
                return new_url
            except Exception:
                # rollback safely on DB errors and continue retrying
                db.session.rollback()
                continue

    # If we exhaust attempts, surface an error for higher-level handling
    raise GenerationError("Failed to generate a unique code after multiple attempts")

def get_by_code(code: str) -> Optional[Url]:
    """Lookup a Url row by its code."""
    if not code:
        return None
    return Url.query.filter_by(code=code).first()

def increment_clicks(url_obj: Url) -> None:
    """Increment click count in a safe way."""
    if url_obj is None:
        return
    url_obj.clicks = (url_obj.clicks or 0) + 1
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
