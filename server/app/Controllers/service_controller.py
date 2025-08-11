# service_controller.py
from app.models.service import Service
from app import db

def create_service(name, price, description=None):
    new_service = Service(
        name=name,
        price=price,
        description=description
    )
    db.session.add(new_service)
    db.session.commit()
    return new_service

def get_service(service_id):
    return Service.query.get(service_id)

def get_all_services():
    return Service.query.all()

def update_service(service_id, updated_data):
    service = Service.query.get(service_id)
    if not service:
        return None
    
    for key, value in updated_data.items():
        setattr(service, key, value)
    
    db.session.commit()
    return service

def delete_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return None
    
    db.session.delete(service)
    db.session.commit()
    return True