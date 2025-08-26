"""
HTTP routes (Blueprint) for the shortener API.

This file focuses on request/response handling and delegates business logic
to `services.shortener`. Errors are translated to proper HTTP responses.
"""
from flask import Blueprint, request, jsonify, current_app, redirect
from datetime import datetime

from services.shortener import create_short_url, get_by_code, increment_clicks, InvalidURLError, GenerationError
from models import db

bp = Blueprint('api', __name__)


@bp.route('/', methods=['GET'])
def index():
    """Simple landing page for the service.

    Returns a minimal HTML page so visiting the root URL doesn't show 404.
    """
    base = current_app.config.get('BASE_URL') or request.host_url.rstrip('/')
    html = f"""
    <html>
      <head><title>URL Shortener</title></head>
      <body style="font-family: Arial, sans-serif;">
        <h1>URL Shortener</h1>
        <p>Service is running. Use the <code>/shorten</code> endpoint to create short links.</p>
        <p>Example: <code>POST {base}/shorten</code></p>
        <p>API info endpoint: <a href="{base}/api/info/your_code">/api/info/&lt;code&gt;</a></p>
      </body>
    </html>
    """
    return html, 200


@bp.route('/health', methods=['GET'])
def health():
    """Health-check endpoint returning JSON status."""
    return jsonify({"status": "ok", "service": "url-shortener"}), 200


@bp.route('/shorten', methods=['POST'])
def shorten():
    """
    Create a short URL.
    Expected JSON payload: { "url": "<original>", "expiry_days": 7 (optional) }
    """
    # Simple JSON body handling
    data = request.get_json(silent=True) or {}
    original = data.get('url')
    expiry = data.get('expiry_days')

    if not original:
        return jsonify({"error": "url is required"}), 400

    try:
        url_obj = create_short_url(original, expiry_days=expiry)
    except InvalidURLError:
        return jsonify({"error": "invalid url"}), 400
    except GenerationError:
        return jsonify({"error": "unable to generate short code"}), 500
    except Exception:
        current_app.logger.exception("Unexpected error creating short URL")
        return jsonify({"error": "internal error"}), 500

    base = current_app.config.get('BASE_URL') or request.host_url.rstrip('/')
    return jsonify(url_obj.to_dict(base_url=base)), 201


@bp.route('/api/info/<string:code>', methods=['GET'])
def info(code):
    """Return metadata for a code."""
    url_obj = get_by_code(code)
    if not url_obj:
        return jsonify({"error": "not found"}), 404
    base = current_app.config.get('BASE_URL') or request.host_url.rstrip('/')
    return jsonify(url_obj.to_dict(base_url=base))


@bp.route('/<string:code>', methods=['GET'])
def redirect_code(code):
    """Redirect to original URL; increment click counter."""
    url_obj = get_by_code(code)
    if not url_obj:
        return jsonify({"error": "not found"}), 404

    # expiry check
    if url_obj.expires_at and url_obj.expires_at < datetime.utcnow():
        return jsonify({"error": "link expired"}), 404

    # increment click counter (keep simple and synchronous for now)
    increment_clicks(url_obj)

    # Send an explicit 302 redirect
    return redirect(url_obj.original_url, code=302)
