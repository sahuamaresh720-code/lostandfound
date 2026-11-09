from datetime import datetime
from app.models.item import Item
from app.models.category import Category
from app.models import db

class ItemService:
    @staticmethod
    def create_item(title, description, item_type, location, date_occurred, category_id, user_id, image_path=None):
        """Create a new lost or found item report"""
        # Validate category exists
        category = Category.query.get(category_id)
        if not category:
            raise ValueError('Invalid category')

        # Parse date if it's a string
        if isinstance(date_occurred, str):
            date_occurred = datetime.strptime(date_occurred, '%Y-%m-%d').date()

        item = Item(
            title=title,
            description=description,
            item_type=item_type,
            location=location,
            date_occurred=date_occurred,
            category_id=category_id,
            user_id=user_id,
            image_path=image_path
        )

        db.session.add(item)
        db.session.commit()

        return item

    @staticmethod
    def get_item_by_id(item_id):
        """Get item by ID"""
        return Item.query.get(item_id)

    @staticmethod
    def get_all_items(filters=None):
        """Get all items with optional filters"""
        query = Item.query

        if filters:
            # Filter by item type (lost/found)
            if 'item_type' in filters:
                query = query.filter_by(item_type=filters['item_type'])

            # Filter by category
            if 'category_id' in filters:
                query = query.filter_by(category_id=filters['category_id'])

            # Filter by approval status (only show approved items for public view)
            if 'approval_status' in filters:
                query = query.filter_by(approval_status=filters['approval_status'])

            # Filter by recovery status
            if 'recovery_status' in filters:
                query = query.filter_by(recovery_status=filters['recovery_status'])

            # Search by title or description
            if 'search' in filters:
                search_term = f"%{filters['search']}%"
                query = query.filter(
                    (Item.title.ilike(search_term)) |
                    (Item.description.ilike(search_term))
                )

            # Filter by location
            if 'location' in filters:
                location_term = f"%{filters['location']}%"
                query = query.filter(Item.location.ilike(location_term))

        return query.order_by(Item.created_at.desc()).all()

    @staticmethod
    def get_user_items(user_id):
        """Get all items reported by a specific user"""
        return Item.query.filter_by(user_id=user_id).order_by(Item.created_at.desc()).all()

    @staticmethod
    def update_item(item_id, **kwargs):
        """Update item details"""
        item = Item.query.get(item_id)
        if not item:
            raise ValueError('Item not found')

        for key, value in kwargs.items():
            if hasattr(item, key):
                setattr(item, key, value)

        item.updated_at = datetime.utcnow()
        db.session.commit()

        return item

    @staticmethod
    def delete_item(item_id):
        """Delete an item"""
        item = Item.query.get(item_id)
        if not item:
            raise ValueError('Item not found')

        db.session.delete(item)
        db.session.commit()

        return True

    @staticmethod
    def find_matching_items(lost_item):
        """Find potential matches for a lost item among found items"""
        # Find found items with same category
        matching_items = Item.query.filter_by(
            item_type='found',
            category_id=lost_item.category_id,
            approval_status='approved',
            recovery_status='unclaimed'
        ).all()

        matches = []
        for item in matching_items:
            score = 0
            reasons = []

            # Check location similarity
            if lost_item.location.lower() in item.location.lower() or item.location.lower() in lost_item.location.lower():
                score += 30
                reasons.append('Similar location')

            # Check date proximity (within 7 days)
            if lost_item.date_occurred and item.date_occurred:
                date_diff = abs((lost_item.date_occurred - item.date_occurred).days)
                if date_diff <= 7:
                    score += 20
                    reasons.append(f'Date within {date_diff} days')

            # Check title similarity
            if lost_item.title.lower() in item.title.lower() or item.title.lower() in lost_item.title.lower():
                score += 30
                reasons.append('Similar title')

            # Check description keywords
            lost_words = set(lost_item.description.lower().split())
            found_words = set(item.description.lower().split())
            common_words = lost_words.intersection(found_words)
            if len(common_words) >= 3:
                score += 20
                reasons.append('Similar description keywords')

            if score >= 50:
                matches.append({
                    'item': item,
                    'score': score,
                    'reasons': reasons
                })

        # Sort by score descending
        matches.sort(key=lambda x: x['score'], reverse=True)
        return matches[:5]  # Return top 5 matches
