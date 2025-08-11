# client.py
from app.database.db import db
from datetime import datetime

class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False, unique=True)
    address = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relaciones
    orders = db.relationship("Order", back_populates="client", lazy=True)

    def to_dict(self, include_orders=False):
        client = {
            "id": self.id,
            "name": self.name,
            "phone_number": self.phone_number,
            "address": self.address,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if include_orders:
            client["orders"] = [order.to_dict() for order in self.orders]
        return client