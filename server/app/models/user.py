from app.database.db import db
from datetime import datetime

class Users(db.Model):
    __tablename__= "users"

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    rol = db.Column(db.String(20), default="empleado")
    state = db.Column(db.String(20), default="activo")
    created_at = db.Column(db.DateTime, default = datetime.now())
    #relaciones inversas
    orders = db.relationship("Order", backref = "users", lazy = True)

    def to_dict(self, orders:bool=False):
        user = {
            "id":self.id,
            "name":self.name,
            "email":self.email,
            "rol":self.rol,
            "state":self.state,
            "created_at":self.created_at,
        }
        if orders:
            user["orders"] = self.orders
        return user