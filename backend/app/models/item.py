from datetime import datetime
from .user import db

class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    item_type = db.Column(db.String(20), nullable=False)  # 'lost' or 'found'
    location = db.Column(db.String(200), nullable=False)
    date_occurred = db.Column(db.Date, nullable=False)  # Date lost or found
    image_path = db.Column(db.String(500))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    approval_status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    recovery_status = db.Column(db.String(20), default='unclaimed')  # 'unclaimed', 'claimed', 'returned'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    claims = db.relationship('Claim', backref='item', lazy=True)

    def to_dict(self):
        """Convert item object to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'item_type': self.item_type,
            'location': self.location,
            'date_occurred': self.date_occurred.isoformat() if self.date_occurred else None,
            'image_path': self.image_path,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'user_id': self.user_id,
            'owner_name': self.owner.full_name if self.owner else None,
            'approval_status': self.approval_status,
            'recovery_status': self.recovery_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
