from flask import Blueprint, request, jsonify, session
from app.services.claim_service import ClaimService
from app.routes.auth import login_required, admin_required

claims_bp = Blueprint('claims', __name__)

@claims_bp.route('/api/claims', methods=['POST'])
@login_required
def create_claim():
    """Create a new claim for an item"""
    try:
        data = request.get_json()

        if 'item_id' not in data or 'explanation' not in data:
            return jsonify({'error': 'item_id and explanation are required'}), 400

        if not data['explanation'].strip():
            return jsonify({'error': 'Explanation cannot be empty'}), 400

        claim = ClaimService.create_claim(
            item_id=data['item_id'],
            user_id=session['user_id'],
            explanation=data['explanation']
        )

        return jsonify({
            'message': 'Claim submitted successfully',
            'claim': claim.to_dict()
        }), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to submit claim'}), 500

@claims_bp.route('/api/claims/my', methods=['GET'])
@login_required
def get_my_claims():
    """Get claims submitted by current user"""
    try:
        claims = ClaimService.get_user_claims(session['user_id'])
        return jsonify({'claims': [claim.to_dict() for claim in claims]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch your claims'}), 500

@claims_bp.route('/api/claims', methods=['GET'])
@admin_required
def get_all_claims():
    """Get all claims (admin only)"""
    try:
        claims = ClaimService.get_all_claims()
        return jsonify({'claims': [claim.to_dict() for claim in claims]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch claims'}), 500

@claims_bp.route('/api/claims/pending', methods=['GET'])
@admin_required
def get_pending_claims():
    """Get all pending claims (admin only)"""
    try:
        claims = ClaimService.get_pending_claims()
        return jsonify({'claims': [claim.to_dict() for claim in claims]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch pending claims'}), 500

@claims_bp.route('/api/claims/<int:claim_id>/approve', methods=['POST'])
@admin_required
def approve_claim(claim_id):
    """Approve a claim (admin only)"""
    try:
        data = request.get_json()
        admin_notes = data.get('admin_notes') if data else None

        ClaimService.update_claim_status(claim_id, 'approved', admin_notes)
        return jsonify({'message': 'Claim approved successfully'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to approve claim'}), 500

@claims_bp.route('/api/claims/<int:claim_id>/reject', methods=['POST'])
@admin_required
def reject_claim(claim_id):
    """Reject a claim (admin only)"""
    try:
        data = request.get_json()
        admin_notes = data.get('admin_notes') if data else None

        ClaimService.update_claim_status(claim_id, 'rejected', admin_notes)
        return jsonify({'error': 'Claim rejected successfully'}), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Failed to reject claim'}), 500
