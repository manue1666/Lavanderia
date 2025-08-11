# user.py
from app.database.db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.String(20), default="empleado")
    state = db.Column(db.String(20), default="activo")
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relaciones
    orders = db.relationship("Order", back_populates="user", lazy=True)
    logs = db.relationship("Log", back_populates="user", lazy=True)

    def to_dict(self, include_orders=False):
        user = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rol": self.rol,
            "state": self.state,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
        if include_orders:
            user["orders"] = [order.to_dict() for order in self.orders]
        return user