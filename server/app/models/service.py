from app.database.db import db

class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    
    # Relación con OrderDetail
    order_details = db.relationship("OrderDetail", back_populates="service", lazy=True)
    
    def to_dict(self, include_order_details=False):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "order_details": [od.to_dict() for od in self.order_details] if include_order_details else None
        }