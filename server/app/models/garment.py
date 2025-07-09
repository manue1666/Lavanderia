from app.database.db import db

class Garment(db.Model):
    __tablename__ = "garments"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    observations = db.Column(db.String(255))

    # Relaciones
    order = db.relationship("Order", back_populates="garments")
    order_details = db.relationship("OrderDetail", back_populates="garment", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_details=False):
        garment = {
            "id": self.id,
            "order_id": self.order_id,
            "type": self.type,
            "description": self.description,
            "observations": self.observations
        }
        if include_details:
            garment["order_details"] = [od.to_dict() for od in self.order_details]
        return garment