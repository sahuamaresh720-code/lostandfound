from flask import Blueprint, request, jsonify, session
from app.services.item_service import ItemService
from app.services.category_service import CategoryService
from app.routes.auth import login_required, admin_required
import os
from werkzeug.utils import secure_filename
from config import Config

items_bp = Blueprint('items', __name__)

def allowed_file(filename):
    """Check if file has allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@items_bp.route('/api/items', methods=['GET'])
def get_items():
    """Get all items with optional filters"""
    try:
        filters = {}

        # Get filter parameters from query string
        if request.args.get('item_type'):
            filters['item_type'] = request.args.get('item_type')
        if request.args.get('category_id'):
            filters['category_id'] = int(request.args.get('category_id'))
        if request.args.get('search'):
            filters['search'] = request.args.get('search')
        if request.args.get('location'):
            filters['location'] = request.args.get('location')

        # For public view, only show approved items
        if session.get('role') != 'admin':
            filters['approval_status'] = 'approved'

        items = ItemService.get_all_items(filters)
        return jsonify({'items': [item.to_dict() for item in items]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch items'}), 500

@items_bp.route('/api/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Get item by ID"""
    try:
        item = ItemService.get_item_by_id(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404

        # Only show approved items to non-admin users
        if item.approval_status != 'approved' and session.get('role') != 'admin':
            return jsonify({'error': 'Item not found'}), 404

        return jsonify({'item': item.to_dict()}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch item'}), 500

@items_bp.route('/api/items', methods=['POST'])
@login_required
def create_item():
    """Create a new item report"""
    try:
        data = request.form
        image_file = request.files.get('image')

        # Validate required fields
        required_fields = ['title', 'description', 'item_type', 'location', 'date_occurred', 'category_id']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400

        # Validate item_type
        if data['item_type'] not in ['lost', 'found']:
            return jsonify({'error': 'Invalid item type'}), 400

        # Handle image upload
        image_path = None
        if image_file and image_file.filename:
            if not allowed_file(image_file.filename):
                return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg, gif'}), 400

            # Generate secure filename
            filename = secure_filename(image_file.filename)
            # Add timestamp to avoid conflicts
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"

            # Save file
            upload_path = os.path.join(Config.UPLOAD_FOLDER, filename)
            image_file.save(upload_path)
            image_path = filename

        item = ItemService.create_item(
            title=data['title'],
            description=data['description'],
            item_type=data['item_type'],
            location=data['location'],
            date_occurred=data['date_occurred'],
            category_id=int(data['category_id']),
            user_id=session['user_id'],
            image_path=image_path
        )

        return jsonify({
            'message': 'Item report created successfully',
            'item': item.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to create item report'}), 500

@items_bp.route('/api/items/my', methods=['GET'])
@login_required
def get_my_items():
    """Get items reported by current user"""
    try:
        items = ItemService.get_user_items(session['user_id'])
        return jsonify({'items': [item.to_dict() for item in items]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch your items'}), 500

@items_bp.route('/api/items/<int:item_id>', methods=['PUT'])
@login_required
def update_item(item_id):
    """Update item details"""
    try:
        item = ItemService.get_item_by_id(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404

        # Only allow owner or admin to update
        if item.user_id != session['user_id'] and session.get('role') != 'admin':
            return jsonify({'error': 'Permission denied'}), 403

        data = request.get_json()
        ItemService.update_item(item_id, **data)

        updated_item = ItemService.get_item_by_id(item_id)
        return jsonify({
            'message': 'Item updated successfully',
            'item': updated_item.to_dict()
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to update item'}), 500

@items_bp.route('/api/items/<int:item_id>', methods=['DELETE'])
@login_required
def delete_item(item_id):
    """Delete an item"""
    try:
        item = ItemService.get_item_by_id(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404

        # Only allow owner or admin to delete
        if item.user_id != session['user_id'] and session.get('role') != 'admin':
            return jsonify({'error': 'Permission denied'}), 403

        ItemService.delete_item(item_id)
        return jsonify({'message': 'Item deleted successfully'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to delete item'}), 500

@items_bp.route('/api/items/<int:item_id>/approve', methods=['POST'])
@admin_required
def approve_item(item_id):
    """Approve an item (admin only)"""
    try:
        ItemService.update_item(item_id, approval_status='approved')
        return jsonify({'message': 'Item approved successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to approve item'}), 500

@items_bp.route('/api/items/<int:item_id>/reject', methods=['POST'])
@admin_required
def reject_item(item_id):
    """Reject an item (admin only)"""
    try:
        ItemService.update_item(item_id, approval_status='rejected')
        return jsonify({'message': 'Item rejected successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to reject item'}), 500

@items_bp.route('/api/items/<int:item_id>/matches', methods=['GET'])
@login_required
def find_matches(item_id):
    """Find matching items for a lost item"""
    try:
        item = ItemService.get_item_by_id(item_id)
        if not item:
            return jsonify({'error': 'Item not found'}), 404

        if item.item_type != 'lost':
            return jsonify({'error': 'Matches can only be found for lost items'}), 400

        matches = ItemService.find_matching_items(item)

        return jsonify({
            'matches': [
                {
                    'item': match['item'].to_dict(),
                    'score': match['score'],
                    'reasons': match['reasons']
                }
                for match in matches
            ]
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to find matches'}), 500
