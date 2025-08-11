# client_route.py
from flask import Blueprint, request, jsonify
from app.Controllers.client_controller import (
    create_client, get_client, get_all_clients,
    search_clients_by_name, search_clients_by_phone,
    update_client, delete_client
)

client_bp = Blueprint("clients", __name__, url_prefix="/clients")

@client_bp.route('/', methods=['GET'])
def get_clients():
    clients = get_all_clients()
    return jsonify([client.to_dict() for client in clients]), 200

@client_bp.route('/<int:client_id>', methods=['GET'])
def get_single_client(client_id):
    client = get_client(client_id)
    if not client:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.to_dict()), 200

@client_bp.route('/', methods=['POST'])
def create():
    data = request.json
    required_fields = ['name', 'phone_number', 'address']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    client = create_client(
        name=data['name'],
        phone_number=data['phone_number'],
        address=data['address']
    )
    
    if not client:
        return jsonify({"error": "Phone number already in use"}), 400
    
    return jsonify({
        "msg": "Client created successfully",
        "client": client.to_dict()
    }), 201

@client_bp.route('/search', methods=['GET'])
def search():
    name = request.args.get('name')
    phone = request.args.get('phone')
    
    if name:
        clients = search_clients_by_name(name)
    elif phone:
        clients = search_clients_by_phone(phone)
    else:
        clients = get_all_clients()
    
    return jsonify([client.to_dict() for client in clients]), 200

@client_bp.route('/<int:client_id>', methods=['PUT'])
def update(client_id):
    data = request.json
    client = update_client(client_id, data)
    if not client:
        return jsonify({"error": "Client update failed"}), 400
    return jsonify({
        "msg": "Client updated successfully",
        "client": client.to_dict()
    }), 200

@client_bp.route('/<int:client_id>', methods=['DELETE'])
def delete(client_id):
    if not delete_client(client_id):
        return jsonify({"error": "Client not found"}), 404
    return jsonify({"msg": "Client deleted successfully"}), 200