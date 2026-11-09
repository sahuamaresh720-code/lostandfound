from flask import send_from_directory, Blueprint
from config import Config
import os

static_bp = Blueprint('static', __name__)

@static_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(Config.UPLOAD_FOLDER, filename)
