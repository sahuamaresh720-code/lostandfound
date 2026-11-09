from app.models.category import Category
from app.models import db

class CategoryService:
    @staticmethod
    def create_category(name, description=None):
        """Create a new category"""
        # Check if category already exists
        if Category.query.filter_by(name=name).first():
            raise ValueError('Category already exists')

        category = Category(
            name=name,
            description=description
        )

        db.session.add(category)
        db.session.commit()

        return category

    @staticmethod
    def get_category_by_id(category_id):
        """Get category by ID"""
        return Category.query.get(category_id)

    @staticmethod
    def get_all_categories():
        """Get all active categories"""
        return Category.query.filter_by(is_active=True).all()

    @staticmethod
    def update_category(category_id, **kwargs):
        """Update category details"""
        category = Category.query.get(category_id)
        if not category:
            raise ValueError('Category not found')

        for key, value in kwargs.items():
            if hasattr(category, key):
                setattr(category, key, value)

        db.session.commit()

        return category

    @staticmethod
    def delete_category(category_id):
        """Delete a category (soft delete by setting is_active to False)"""
        category = Category.query.get(category_id)
        if not category:
            raise ValueError('Category not found')

        category.is_active = False
        db.session.commit()

        return True

    @staticmethod
    def initialize_default_categories():
        """Initialize default categories if they don't exist"""
        default_categories = [
            {'name': 'Electronics', 'description': 'Phones, laptops, tablets, headphones, etc.'},
            {'name': 'Clothing', 'description': 'Jackets, sweaters, hats, scarves, etc.'},
            {'name': 'Books & Stationery', 'description': 'Textbooks, notebooks, pens, bags, etc.'},
            {'name': 'ID Cards & Documents', 'description': 'Student ID, passport, wallet, etc.'},
            {'name': 'Keys', 'description': 'Room keys, car keys, locker keys, etc.'},
            {'name': 'Accessories', 'description': 'Jewelry, watches, glasses, etc.'},
            {'name': 'Bags & Wallets', 'description': 'Backpacks, handbags, purses, wallets, etc.'},
            {'name': 'Others', 'description': 'Items that do not fit in other categories'}
        ]

        for cat_data in default_categories:
            if not Category.query.filter_by(name=cat_data['name']).first():
                category = Category(
                    name=cat_data['name'],
                    description=cat_data['description']
                )
                db.session.add(category)

        db.session.commit()
