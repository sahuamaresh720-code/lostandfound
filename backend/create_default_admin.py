"""
Script to create a default administrator account.
This creates an admin with hardcoded credentials for initial setup.
IMPORTANT: Change the password after first login!
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.services.auth_service import AuthService
from app.models import db

def create_default_admin():
    """Create a default administrator account"""
    app = create_app()

    with app.app_context():
        # Default admin credentials
        username = "admin"
        email = "admin@university.edu"
        full_name = "System Administrator"
        password = "admin123"  # CHANGE THIS AFTER FIRST LOGIN!

        try:
            user = AuthService.register_user(
                username=username,
                email=email,
                password=password,
                full_name=full_name,
                role='admin'
            )
            print("✓ Default administrator account created successfully!")
            print(f"  Username: {user.username}")
            print(f"  Email: {user.email}")
            print(f"  Full Name: {user.full_name}")
            print(f"  Role: {user.role}")
            print(f"  Password: {password}")
            print()
            print("⚠ IMPORTANT: Change the password after first login!")
        except ValueError as e:
            if "already exists" in str(e):
                print("Admin account already exists.")
            else:
                print(f"Error: {e}")
        except Exception as e:
            print(f"Error creating admin account: {e}")

if __name__ == '__main__':
    create_default_admin()
