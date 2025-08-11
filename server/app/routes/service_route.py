# service_route.py
from flask import Blueprint, request, jsonify
from app.Controllers.service_controller import (
    create_service, get_service, get_all_services,
    update_service, delete_service
)

service_bp = Blueprint('services', __name__, url_prefix='/services')

@service_bp.route('/', methods=['GET'])
def get_services():
    services = get_all_services()
    return jsonify([service.to_dict() for service in services]), 200

@service_bp.route('/<int:service_id>', methods=['GET'])
def get_single_service(service_id):
    service = get_service(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service.to_dict()), 200

@service_bp.route('/', methods=['POST'])
def create():
    data = request.json
    required_fields = ['name', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Name and price are required"}), 400
    
    service = create_service(
        name=data['name'],
        price=data['price'],
        description=data.get('description')
    )
    
    return jsonify({
        "msg": "Service created successfully",
        "service": service.to_dict()
    }), 201

@service_bp.route('/<int:service_id>', methods=['PUT'])
def update(service_id):
    data = request.json
    service = update_service(service_id, data)
    if not service:
        return jsonify({"error": "Service update failed"}), 400
    return jsonify({
        "msg": "Service updated successfully",
        "service": service.to_dict()
    }), 200

@service_bp.route('/<int:service_id>', methods=['DELETE'])
def delete(service_id):
    if not delete_service(service_id):
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"msg": "Service deleted successfully"}), 200