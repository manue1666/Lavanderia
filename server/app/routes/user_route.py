from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app.models.user import Users
from app.Controllers.user_controller import login_user, logout_user, update_user, toggle_user_status, get_user_logs
from app.database.db import db



user_bp= Blueprint("users", __name__, url_prefix="/users")

@user_bp.route("/register", methods=["POST"])
def create_user():
    data=request.get_json()
    name= data.get("name")
    email= data.get("email")
    rol= data.get("rol")
    password= data.get("password")

    if not name or not email or not password:
        return jsonify({"error:"}), 400


    if Users.query.filter_by(email=email).first():
        return jsonify({"error:"}), 400
    
    password_hash = generate_password_hash(password)
    new_user= Users(name=name,email=email,password=password_hash,rol=rol)
    db.session.add(new_user)
    #registra cambio

    db.session.commit()

    return jsonify({"msg":"usuario creado con exito"}), 200


@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    token = login_user(data["email"], data["password"])
    if token:
        return jsonify({"access token": token}),200
    return jsonify({"msg":"algo salio mal revisa claves"}),400


@user_bp.route("/logout/<int:user_id>", methods=["POST"])
def logout(user_id):
    logout_user(user_id)
    return jsonify({"msg":"logout exitoso"}),200


@user_bp.route("/update/<int:user_id>", methods=["PUT"])
def update(user_id):
    data = request.json
    user = update_user(user_id,data)
    if user:
        return jsonify({"msg":"usuario actualizado", "user":user.to_dict()}),200
    return jsonify({"msg":"algo salio mal"}),400


@user_bp.route("/change/<int:user_id>/status", methods=["PATCH"])
def change_status(user_id):
    data = request.json
    is_active = data.get("active")
    user = toggle_user_status(user_id, is_active)
    if user:
        return jsonify({"msg":"estatus actualizado", "activo":user.state}),200
    return jsonify({"msg":"algo salio mal"}),400



@user_bp.route("/get/logs/<int:user_id>", methods=["GET"])
def get_logs(user_id):
    logs = get_user_logs(user_id)
    data = []
    for log in logs:
        log.date = log.date.isoformat()
        data.append(log)
    return jsonify({
        "msg":"logs obtenidos con exito",
        "logs":data
    }), 200