from app.database.db import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("clients.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    estimated_delivery_date = db.Column(db.DateTime, nullable=False)
    real_delivery_date = db.Column(db.DateTime)
    state = db.Column(db.String(50), default="recibido")
    total = db.Column(db.Integer, nullable=False)
    pagado = db.Column(db.Boolean, nullable=False)

    # Relaciones
    garments = db.relationship("Garment", back_populates="order", lazy=True, cascade="all, delete-orphan")
    order_details = db.relationship("OrderDetail", back_populates="order", lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self, include_garments=False, include_details=False):
        order = {
            "id": self.id,
            "client_id": self.client_id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "estimated_delivery_date": self.estimated_delivery_date.isoformat() if self.estimated_delivery_date else None,
            "real_delivery_date": self.real_delivery_date.isoformat() if self.real_delivery_date else None,
            "state": self.state,
            "total": self.total,
            "pagado": self.pagado
        }
        if include_garments:
            order["garments"] = [g.to_dict() for g in self.garments]
        if include_details:
            order["order_details"] = [d.to_dict() for d in self.order_details]
        return order