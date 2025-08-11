# garment_controller.py
from app.models.garment import Garment
from app import db

def create_garment(garment_type, description=None, observations=None):
    new_garment = Garment(
        type=garment_type,
        description=description,
        observations=observations
    )
    db.session.add(new_garment)
    db.session.commit()
    return new_garment

def get_garment(garment_id):
    return Garment.query.get(garment_id)

def get_all_garments():
    return Garment.query.all()

def update_garment(garment_id, updated_data):
    garment = Garment.query.get(garment_id)
    if not garment:
        return None
    
    for key, value in updated_data.items():
        setattr(garment, key, value)
    
    db.session.commit()
    return garment

def delete_garment(garment_id):
    garment = Garment.query.get(garment_id)
    if not garment:
        return None
    
    db.session.delete(garment)
    db.session.commit()
    return True