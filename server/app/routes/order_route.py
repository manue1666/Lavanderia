from flask import Blueprint, request, jsonify
from app.Controllers.order_controller import create_order, add_garment, add_service, create_order_detail,get_order_detail
import datetime
from app.database.db import db
from app.models.service import Service
from app.models.order_detail import OrderDetail
from app.models.garment import Garment



order_bp = Blueprint('order_bp', __name__, url_prefix='/orders')

@order_bp.route('/create', methods=['POST'])
def handle_create_order():
    data = request.json
    
    
    required_fields = ['client_id', 'user_id', 'estimated_delivery_date', 'total', 'garments']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        
        date_parts = list(map(int, data["estimated_delivery_date"].split("-")))
        delivery_date = datetime.date(*date_parts)
        
        
        order = create_order(
            client_id=data["client_id"],
            user_id=data["user_id"],
            estimated_date=delivery_date,
            total_price=data["total"]
        )

        
        for garment_data in data["garments"]:
            garment = add_garment(
                order_id=order.id,
                type=garment_data["type"],
                description=garment_data["description"],
                observations=garment_data["observations"]
            )

            
            for service_data in garment_data["services"]:
                service = Service.query.filter_by(name=service_data["name"]).first()
                if not service:
                    service = add_service(
                        name=service_data["name"],
                        description=service_data["service_description"],
                        price=service_data["unitPrice"]
                    )
                
                order_detail = OrderDetail(
                    order_id=order.id,
                    garment_id=garment.id,
                    service_id=service.id,
                    quantity=service_data["quantity"]
                )
                db.session.add(order_detail)
        
        db.session.commit()

        
        from app.models.client import Client 
        
        order_response = {
            "order_id": order.id,
            "client": Client.query.get(order.client_id).name, 
            "status": order.state,
            "garments": []
        }

        
        garments = Garment.query.filter_by(order_id=order.id).all()
        
        for garment in garments:
            garment_data = {
                "type": garment.type,
                "description": garment.description,
                "observations": garment.observations,
                "services": []
            }

            
            details = OrderDetail.query.filter_by(garment_id=garment.id).all()
            
            for detail in details:
                service = Service.query.get(detail.service_id)
                if service:
                    garment_data["services"].append({
                        "name": service.name,
                        "description": service.description,
                        "price": float(service.price),
                        "quantity": detail.quantity
                    })

            order_response["garments"].append(garment_data)

        return jsonify(order_response), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@order_bp.route("/get-order-detail/<int:order_id>",methods=["GET"])
def get_order_detail_endpoint(order_id):
    try:
        order = get_order_detail(order_id)
        return jsonify({"msg":"detale de orden obtenido", "order":order}),200
    except Exception as e:
        return jsonify({"msg":"fallo", "error":e}),500