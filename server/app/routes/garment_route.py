# garment_route.py
from flask import Blueprint, request, jsonify
from app.Controllers.garment_controller import (
    create_garment, get_garment, get_all_garments,
    update_garment, delete_garment
)

garment_bp = Blueprint('garments', __name__, url_prefix='/garments')

@garment_bp.route('/', methods=['GET'])
def get_garments():
    garments = get_all_garments()
    return jsonify([garment.to_dict() for garment in garments]), 200

@garment_bp.route('/<int:garment_id>', methods=['GET'])
def get_single_garment(garment_id):
    garment = get_garment(garment_id)
    if not garment:
        return jsonify({"error": "Garment not found"}), 404
    return jsonify(garment.to_dict()), 200

@garment_bp.route('/', methods=['POST'])
def create():
    data = request.json
    required_fields = ['type']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Type is required"}), 400
    
    garment = create_garment(
        garment_type=data['type'],
        description=data.get('description'),
        observations=data.get('observations')
    )
    
    return jsonify({
        "msg": "Garment created successfully",
        "garment": garment.to_dict()
    }), 201

@garment_bp.route('/<int:garment_id>', methods=['PUT'])
def update(garment_id):
    data = request.json
    garment = update_garment(garment_id, data)
    if not garment:
        return jsonify({"error": "Garment update failed"}), 400
    return jsonify({
        "msg": "Garment updated successfully",
        "garment": garment.to_dict()
    }), 200

@garment_bp.route('/<int:garment_id>', methods=['DELETE'])
def delete(garment_id):
    if not delete_garment(garment_id):
        return jsonify({"error": "Garment not found"}), 404
    return jsonify({"msg": "Garment deleted successfully"}), 200