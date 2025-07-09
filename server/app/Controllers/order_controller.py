from app.database.db import db
from app.models.order import Order
from app.models.garment import Garment
from app.models.service import Service
from app.models.order_detail import OrderDetail


def create_order(client_id, user_id, estimated_date, total_price):
    order = Order(
        client_id=client_id,
        user_id=user_id,
        estimated_delivery_date=estimated_date,
        total=total_price,
        state="recibido", 
        pagado=False      
    )
    db.session.add(order)
    db.session.commit()
    return order



def add_garment(order_id, type, description, observations):
    garment = Garment(order_id=order_id,
                      type=type,
                      description=description,
                      observations=observations)
    db.session.add(garment)
    db.session.commit()
    return garment


def create_order_detail(garment_id, service_id, quantity):
    order_detail = OrderDetail(garment_id=garment_id,
                               service_id=service_id,
                               quantity=quantity)
    db.session.add(order_detail)
    db.session.commit()
    return order_detail


def update_order_status(order_id, new_status):
    order = Order.query.get(order_id)
    if not order:
        return None
    order.state = new_status
    db.session.commit()
    return order

def list_orders_by_status(status):
    orders = Order.query.filter_by(state=status).all()
    data = [{
        "id":o.id,
        "client_id": o.client_id,
        "state": o.state,
        "estimated_delivery_date": o.estimated_delivery_date,
        "total": o.total,
        "pagado": o.pagado,
    } for o in orders]
    return data


def add_service(name, description, price):
    service = Service(name=name, description=description, price=price)
    db.session.add(service)
    db.session.commit()
    return service


def get_order_detail(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404

        order_data = {
            "order_id": order.id,
            "client": order.clients.name if order.clients else None,
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
                
                service = detail.service  
                
                if service:  
                    garment_data["services"].append({
                        "name": service.name,
                        "description": service.description,
                        "price": float(service.price),
                        "quantity": detail.quantity  
                    })

            order_data["garments"].append(garment_data)

        return order_data

    except Exception as e:
        return {"error": str(e)}, 500