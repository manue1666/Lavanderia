# user_route.py
from flask import Blueprint, request, jsonify
from app.Controllers.user_controller import (
    create_user, login_user, logout_user, 
    get_user, get_all_users, update_user,
    toggle_user_status, delete_user, get_user_logs
)
from werkzeug.security import generate_password_hash

user_bp = Blueprint("users", __name__, url_prefix="/users")

@user_bp.route("/", methods=["GET"])
def get_users():
    users = get_all_users()
    return jsonify([user.to_dict() for user in users]), 200

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_single_user(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required_fields = ["name", "email", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    user = create_user(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        rol=data.get("rol", "empleado")
    )
    
    if not user:
        return jsonify({"error": "Email already in use"}), 400
    
    return jsonify({
        "msg": "User created successfully",
        "user": user.to_dict()
    }), 201

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    token = login_user(data.get("email"), data.get("password"))
    if not token:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"access_token": token}), 200

@user_bp.route("/logout/<int:user_id>", methods=["POST"])
def logout(user_id):
    if not logout_user(user_id):
        return jsonify({"error": "Logout failed"}), 400
    return jsonify({"msg": "Logout successful"}), 200

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user_route(user_id):
    data = request.get_json()
    user = update_user(user_id, data)
    if not user:
        return jsonify({"error": "User update failed"}), 400
    return jsonify({"msg": "User updated", "user": user.to_dict()}), 200

@user_bp.route("/<int:user_id>/status", methods=["PATCH"])
def change_status(user_id):
    data = request.get_json()
    is_active = data.get("active", True)
    user = toggle_user_status(user_id, is_active)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"msg": "Status updated", "active": user.state}), 200

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user_route(user_id):
    if not delete_user(user_id):
        return jsonify({"error": "User not found"}), 404
    return jsonify({"msg": "User deleted"}), 200

@user_bp.route("/<int:user_id>/logs", methods=["GET"])
def get_user_logs_route(user_id):
    logs = get_user_logs(user_id)
    return jsonify([{
        "id": log.id,
        "action": log.action,
        "date": log.date.isoformat() if log.date else None
    } for log in logs]), 200
