from flask import Flask, session
from flask_cors import CORS
from config import Config
from app.models import db
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure session
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_HTTPONLY'] = True

    # Enable CORS for all routes with credentials
    CORS(app, supports_credentials=True, resources={r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "credentials": True
    }})

    # Initialize database
    db.init_app(app)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.items import items_bp
    from app.routes.claims import claims_bp
    from app.routes.categories import categories_bp
    from app.routes.static import static_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(items_bp)
    app.register_blueprint(claims_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(static_bp)

    # Create database tables
    with app.app_context():
        db.create_all()

        # Initialize default categories
        from app.services.category_service import CategoryService
        CategoryService.initialize_default_categories()

    return app
