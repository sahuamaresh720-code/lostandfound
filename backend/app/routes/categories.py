from flask import Blueprint, jsonify, session
from app.services.category_service import CategoryService
from app.routes.auth import login_required, admin_required

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all active categories"""
    try:
        categories = CategoryService.get_all_categories()
        return jsonify({'categories': [category.to_dict() for category in categories]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch categories'}), 500

@categories_bp.route('/api/categories', methods=['POST'])
@admin_required
def create_category():
    """Create a new category (admin only)"""
    from flask import request

    try:
        data = request.get_json()

        if 'name' not in data or not data['name']:
            return jsonify({'error': 'Category name is required'}), 400

        category = CategoryService.create_category(
            name=data['name'],
            description=data.get('description')
        )

        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to create category'}), 500

@categories_bp.route('/api/categories/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    """Update a category (admin only)"""
    from flask import request

    try:
        data = request.get_json()
        CategoryService.update_category(category_id, **data)

        category = CategoryService.get_category_by_id(category_id)
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to update category'}), 500

@categories_bp.route('/api/categories/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    """Delete a category (admin only)"""
    try:
        CategoryService.delete_category(category_id)
        return jsonify({'message': 'Category deleted successfully'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to delete category'}), 500
