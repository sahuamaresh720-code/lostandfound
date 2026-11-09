from app.models.claim import Claim
from app.models.item import Item
from app.models import db

class ClaimService:
    @staticmethod
    def create_claim(item_id, user_id, explanation):
        """Create a new claim for an item"""
        # Check if item exists
        item = Item.query.get(item_id)
        if not item:
            raise ValueError('Item not found')

        # Check if item is a found item
        if item.item_type != 'found':
            raise ValueError('Can only claim found items')

        # Check if item is approved
        if item.approval_status != 'approved':
            raise ValueError('Cannot claim unapproved items')

        # Check if item is already claimed
        if item.recovery_status != 'unclaimed':
            raise ValueError('Item is already claimed')

        # Check if user already claimed this item
        existing_claim = Claim.query.filter_by(item_id=item_id, user_id=user_id).first()
        if existing_claim:
            raise ValueError('You have already claimed this item')

        claim = Claim(
            item_id=item_id,
            user_id=user_id,
            explanation=explanation
        )

        db.session.add(claim)
        db.session.commit()

        return claim

    @staticmethod
    def get_claim_by_id(claim_id):
        """Get claim by ID"""
        return Claim.query.get(claim_id)

    @staticmethod
    def get_user_claims(user_id):
        """Get all claims by a specific user"""
        return Claim.query.filter_by(user_id=user_id).order_by(Claim.created_at.desc()).all()

    @staticmethod
    def get_all_claims():
        """Get all claims (for admin)"""
        return Claim.query.order_by(Claim.created_at.desc()).all()

    @staticmethod
    def get_pending_claims():
        """Get all pending claims"""
        return Claim.query.filter_by(status='pending').order_by(Claim.created_at.desc()).all()

    @staticmethod
    def update_claim_status(claim_id, status, admin_notes=None):
        """Update claim status (approve/reject)"""
        claim = Claim.query.get(claim_id)
        if not claim:
            raise ValueError('Claim not found')

        claim.status = status
        if admin_notes:
            claim.admin_notes = admin_notes

        # If claim is approved, update item recovery status
        if status == 'approved':
            item = Item.query.get(claim.item_id)
            if item:
                item.recovery_status = 'claimed'

        db.session.commit()

        return claim

    @staticmethod
    def delete_claim(claim_id):
        """Delete a claim"""
        claim = Claim.query.get(claim_id)
        if not claim:
            raise ValueError('Claim not found')

        db.session.delete(claim)
        db.session.commit()

        return True
