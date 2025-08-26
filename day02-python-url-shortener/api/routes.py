from flask import Blueprint, request, jsonify, current_app, redirect, render_template
from datetime import datetime

from services.shortener import (
    create_short_url,
    get_by_code,
    increment_clicks,
    InvalidURLError,
    GenerationError,
)

bp = Blueprint('api', __name__)


@bp.route('/', methods=['GET'])
def index():
    # render the template-based frontend
    return render_template('index.html'), 200


@bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "url-shortener"}), 200


@bp.route('/shorten', methods=['POST'])
def shorten():
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
    url_obj = get_by_code(code)
    if not url_obj:
        return jsonify({"error": "not found"}), 404
    base = current_app.config.get('BASE_URL') or request.host_url.rstrip('/')
    return jsonify(url_obj.to_dict(base_url=base))


@bp.route('/<string:code>', methods=['GET'])
def redirect_code(code):
    url_obj = get_by_code(code)
    if not url_obj:
        return jsonify({"error": "not found"}), 404

    if url_obj.expires_at and url_obj.expires_at < datetime.utcnow():
        return jsonify({"error": "link expired"}), 404

    increment_clicks(url_obj)
    return redirect(url_obj.original_url, code=302)
