# client_controller.py
from app.models.client import Client
from app import db

def create_client(name, phone_number, address):
    existing_client = Client.query.filter_by(phone_number=phone_number).first()
    if existing_client:
        return None
    
    new_client = Client(
        name=name,
        phone_number=phone_number,
        address=address
    )
    db.session.add(new_client)
    db.session.commit()
    return new_client

def get_client(client_id):
    return Client.query.get(client_id)

def get_all_clients():
    return Client.query.all()

def search_clients_by_name(name):
    return Client.query.filter(Client.name.ilike(f"%{name}%")).all()

def search_clients_by_phone(phone):
    return Client.query.filter(Client.phone_number.ilike(f"%{phone}%")).all()

def update_client(client_id, updated_data):
    client = Client.query.get(client_id)
    if not client:
        return None
    
    if 'phone_number' in updated_data:
        existing_client = Client.query.filter_by(phone_number=updated_data['phone_number']).first()
        if existing_client and existing_client.id != client_id:
            return None  # Phone number already in use
    
    for key, value in updated_data.items():
        setattr(client, key, value)
    
    db.session.commit()
    return client

def delete_client(client_id):
    client = Client.query.get(client_id)
    if not client:
        return None
    
    db.session.delete(client)
    db.session.commit()
    return True