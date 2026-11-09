from app.models.user import User
from app.models import db

class AuthService:
    @staticmethod
    def register_user(username, email, password, full_name, role='student'):
        """Register a new user"""
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')

        # Create new user
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            role=role
        )
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def authenticate_user(username, password):
        """Authenticate user with username and password"""
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password) and user.is_active:
            return user

        return None

    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)

    @staticmethod
    def get_all_users():
        """Get all users (for admin)"""
        return User.query.all()
