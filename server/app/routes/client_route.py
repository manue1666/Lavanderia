from flask import Blueprint, request, jsonify
from app.database.db import db
from app.Controllers.client_controller import create_client, search_client_by_name,search_client_by_phone_number,update_client,delete_client

client_bp = Blueprint("client_bp", __name__, url_prefix="/clients")

@client_bp.route("/create", methods=["POST"])
def create():
    data = request.json
    name = data.get("name"),
    phone_number = data.get("phone_number")
    address= data.get("address")

    if not name or not phone_number or not address:
        return jsonify({"error":"completa los datos"}),400
    
    client = create_client(name,phone_number,address)
    return jsonify({
        "msg":"cliente creado con exito",
        "client":client.to_dict()
    }),200



@client_bp.route("/search/name", methods=["GET"])
def search_by_name():
    name = request.args.get("name")
    clients= search_client_by_name(name)
    #fanci
    data = [client.to_dict() for client in clients]
    return jsonify(data), 200

@client_bp.route("/search/phone", methods=["GET"])
def search_by_phone():
    phone = request.args.get("phone")
    client = search_client_by_phone_number(phone)
    if not client:
        return jsonify({"error":"cliente no found"}),400
    return jsonify(client.to_dict()),200

@client_bp.route("/update/<int:client_id>", methods=["PUT"])
def update(client_id):
    data = request.json
    client = update_client(client_id, data)
    if not client:
        return jsonify({"error":"client not found"}),400
    return jsonify({"msg":"client updateado con exito"}),200

@client_bp.route("/delete/<int:client_id>", methods=["DELETE"])
def delete(client_id):
    client = delete_client(client_id)
    if not client:
        return jsonify({"error":"client not found"}),400   
    return jsonify({"msg":"client eliminad con exito"}),200