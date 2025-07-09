from app.database.db import db

class OrderDetail(db.Model):
    __tablename__ = "order_details"
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    garment_id = db.Column(db.Integer, db.ForeignKey("garments.id"), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey("services.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    
    # Relaciones
    order = db.relationship("Order", back_populates="order_details")
    garment = db.relationship("Garment", back_populates="order_details")
    service = db.relationship("Service", back_populates="order_details")
    
    def to_dict(self, include_garment=False, include_service=False):
        data = {
            "id": self.id,
            "order_id": self.order_id,
            "garment_id": self.garment_id,
            "service_id": self.service_id,
            "quantity": self.quantity
        }
        if include_garment:
            data["garment"] = self.garment.to_dict()
        if include_service:
            data["service"] = self.service.to_dict()
        return data