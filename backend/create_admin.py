"""
Script to create the first administrator account.
Run this after setting up the database to create an admin user.
"""
import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.services.auth_service import AuthService
from app.models import db

def create_admin_account():
    """Create an administrator account"""
    app = create_app()

    with app.app_context():
        print("=== Create Administrator Account ===")
        print()

        username = input("Enter admin username: ")
        email = input("Enter admin email: ")
        full_name = input("Enter admin full name: ")
        password = input("Enter admin password: ")

        if not username or not email or not full_name or not password:
            print("Error: All fields are required")
            return

        try:
            user = AuthService.register_user(
                username=username,
                email=email,
                password=password,
                full_name=full_name,
                role='admin'
            )
            print()
            print("✓ Administrator account created successfully!")
            print(f"  Username: {user.username}")
            print(f"  Email: {user.email}")
            print(f"  Full Name: {user.full_name}")
            print(f"  Role: {user.role}")
            print()
            print("You can now login with these credentials.")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Error creating admin account: {e}")

if __name__ == '__main__':
    create_admin_account()
