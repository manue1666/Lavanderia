# order_route.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from app.Controllers.order_controller import (
    create_order, get_order, get_all_orders,
    update_order, delete_order, update_order_status,
    add_garment_to_order, add_service_to_garment,
    get_order_details, get_orders_by_status,
    get_dashboard_orders, get_pending_orders,
    get_system_counts
)

order_bp = Blueprint('orders', __name__, url_prefix='/orders')

@order_bp.route('/', methods=['GET'])
def get_orders():
    orders = get_all_orders()
    return jsonify([order.to_dict() for order in orders]), 200

@order_bp.route('/<int:order_id>', methods=['GET'])
def get_single_order(order_id):
    order = get_order(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(order.to_dict(include_details=True)), 200

@order_bp.route('/', methods=['POST'])
def handle_create_order():
    data = request.json
    required_fields = ['client_id', 'user_id', 'estimated_delivery_date', 'total']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        delivery_date = datetime.fromisoformat(data["estimated_delivery_date"])
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    order = create_order(
        client_id=data["client_id"],
        user_id=data["user_id"],
        estimated_date=delivery_date,
        total_price=data["total"]
    )

    if not order:
        return jsonify({"error": "Order creation failed"}), 400

    return jsonify({
        "msg": "Order created successfully",
        "order": order.to_dict()
    }), 201

@order_bp.route('/<int:order_id>', methods=['PUT'])
def update_order_route(order_id):
    data = request.json
    order = update_order(order_id, data)
    if not order:
        return jsonify({"error": "Order update failed"}), 400
    return jsonify({"msg": "Order updated", "order": order.to_dict()}), 200

@order_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order_route(order_id):
    if not delete_order(order_id):
        return jsonify({"error": "Order not found"}), 404
    return jsonify({"msg": "Order deleted"}), 200

@order_bp.route('/<int:order_id>/status', methods=['PATCH'])
def change_order_status(order_id):
    data = request.json
    new_status = data.get("status")
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
    
    order = update_order_status(order_id, new_status)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    
    return jsonify({
        "msg": "Order status updated",
        "status": order.state
    }), 200

@order_bp.route('/<int:order_id>/garments', methods=['POST'])
def add_garment_route(order_id):
    data = request.json
    garment = add_garment_to_order(
        order_id=order_id,
        garment_type=data.get("type"),
        description=data.get("description"),
        observations=data.get("observations")
    )
    return jsonify({
        "msg": "Garment added to order",
        "garment": garment.to_dict()
    }), 201

@order_bp.route('/dashboard', methods=['GET'])
def dashboard_orders():
    page = request.args.get('page', 1, type=int)
    orders = get_dashboard_orders(page)
    return jsonify([order.to_dict() for order in orders]), 200

@order_bp.route('/pending', methods=['GET'])
def pending_orders():
    page = request.args.get('page', 1, type=int)
    orders = get_pending_orders(page)
    return jsonify([order.to_dict() for order in orders]), 200

@order_bp.route('/counts', methods=['GET'])
def system_counts():
    counts = get_system_counts()
    return jsonify(counts), 200