# order_controller.py
from app.models.order import Order
from app.models.garment import Garment
from app.models.service import Service
from app.models.order_detail import OrderDetail
from app.models.client import Client
from app.models.user import User
from app import db
from datetime import datetime

def create_order(client_id, user_id, estimated_date, total_price):
    new_order = Order(
        client_id=client_id,
        user_id=user_id,
        estimated_delivery_date=estimated_date,
        total=total_price,
        state="recibido",
        paid=False
    )
    db.session.add(new_order)
    db.session.commit()
    return new_order

def get_order(order_id):
    return Order.query.get(order_id)

def get_all_orders():
    return Order.query.order_by(Order.created_at.desc()).all()

def update_order(order_id, updated_data):
    order = Order.query.get(order_id)
    if not order:
        return None
    
    for key, value in updated_data.items():
        setattr(order, key, value)
    
    db.session.commit()
    return order

def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return None
    
    db.session.delete(order)
    db.session.commit()
    return True

def update_order_status(order_id, new_status):
    order = Order.query.get(order_id)
    if not order:
        return None
    
    order.state = new_status
    db.session.commit()
    return order

def add_garment_to_order(order_id, garment_type, description=None, observations=None):
    garment = Garment(
        type=garment_type,
        description=description,
        observations=observations
    )
    db.session.add(garment)
    db.session.commit()
    return garment

def add_service_to_garment(garment_id, service_id, quantity=1):
    order_detail = OrderDetail(
        garment_id=garment_id,
        service_id=service_id,
        quantity=quantity
    )
    db.session.add(order_detail)
    db.session.commit()
    return order_detail

def get_order_details(order_id):
    order = Order.query.get(order_id)
    if not order:
        return None
    
    return {
        "order": order.to_dict(include_details=True),
        "client": order.client.to_dict(),
        "user": order.user.to_dict()
    }

def get_orders_by_status(status):
    return Order.query.filter_by(state=status).all()

def get_dashboard_orders(pagination=1, per_page=10):
    offset = (pagination - 1) * per_page
    return Order.query.order_by(Order.created_at.desc()).offset(offset).limit(per_page).all()

def get_pending_orders(pagination=1, per_page=10):
    offset = (pagination - 1) * per_page
    pending_states = ["recibido", "en proceso"]
    return Order.query.filter(Order.state.in_(pending_states))\
                     .order_by(Order.created_at.desc())\
                     .offset(offset).limit(per_page).all()

def get_system_counts():
    return {
        "garments": Garment.query.count(),
        "services": Service.query.count(),
        "clients": Client.query.count(),
        "users": User.query.count(),
        "orders": Order.query.count()
    }