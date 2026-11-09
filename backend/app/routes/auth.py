from flask import Blueprint, request, jsonify, session
from app.services.auth_service import AuthService
from functools import wraps

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    """Decorator to require login for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require admin role for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if session.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400

        # Validate email format
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        user = AuthService.register_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            full_name=data['full_name'],
            role='student'  # Default role for registration
        )

        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()

        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password are required'}), 400

        user = AuthService.authenticate_user(data['username'], data['password'])

        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            session['full_name'] = user.full_name

            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user information"""
    try:
        user = AuthService.get_user_by_id(session['user_id'])
        if user:
            return jsonify({'user': user.to_dict()}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Failed to get user information'}), 500

@auth_bp.route('/api/auth/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session['user_id'],
                'username': session['username'],
                'role': session['role'],
                'full_name': session['full_name']
            }
        }), 200
    else:
        return jsonify({'authenticated': False}), 200
