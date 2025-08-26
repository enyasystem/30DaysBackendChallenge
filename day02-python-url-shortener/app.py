"""
Application factory for the URL shortener.

This file creates and configures the Flask app, initializes extensions,
and registers blueprints. Using a factory makes testing easier and
is more scalable for future features.
"""
import logging
import os
from dotenv import load_dotenv
from flask import Flask
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

# local imports here to avoid circular imports at top-level
def create_app():
    # Basic Flask app factory
    app = Flask(__name__, instance_relative_config=False)

    # Configuration - keep secrets/config outside code
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///./data.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['BASE_URL'] = os.getenv('BASE_URL', 'http://localhost:8080')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    # Rate limit default (can be tuned)
    app.config['RATELIMIT_DEFAULT'] = "60 per minute"

    # Initialize logging (simple console logger - extend for prod)
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

    # Initialize extensions (deferred imports to keep factory clean)
    from models import db
    db.init_app(app)

    migrate = Migrate()
    migrate.init_app(app, db)

    limiter = Limiter(key_func=get_remote_address)
    limiter.init_app(app)

    # Register API blueprint
    from api.routes import bp as api_bp
    app.register_blueprint(api_bp)

    return app


if __name__ == "__main__":
    # Run development server
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
