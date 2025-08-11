# user_controller.py
from app.models.user import User
from app.models.log import Log
from app import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime

def create_user(name, email, password, rol="empleado"):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return None
    
    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
        rol=rol
    )
    db.session.add(new_user)
    db.session.commit()
    return new_user

def get_user(user_id):
    return User.query.get(user_id)

def get_all_users():
    return User.query.all()

def login_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        log = Log(user_id=user.id, action="login", date=datetime.now())
        db.session.add(log)
        db.session.commit()
        return access_token
    return None

def logout_user(user_id):
    log = Log(user_id=user_id, action="logout", date=datetime.now())
    db.session.add(log)
    db.session.commit()
    return True

def update_user(user_id, updated_data):
    user = User.query.get(user_id)
    if not user:
        return None
    
    if 'email' in updated_data:
        existing_user = User.query.filter_by(email=updated_data['email']).first()
        if existing_user and existing_user.id != user_id:
            return None  # Email already in use
    
    for key, value in updated_data.items():
        if key == "password":
            setattr(user, key, generate_password_hash(value))
        else:
            setattr(user, key, value)

    db.session.commit()
    return user

def toggle_user_status(user_id, is_active):
    user = User.query.get(user_id)
    if not user:
        return None
    
    user.state = "activo" if is_active else "inactivo"
    db.session.commit()
    return user

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return None
    
    db.session.delete(user)
    db.session.commit()
    return True

def get_user_logs(user_id):
    return Log.query.filter_by(user_id=user_id).order_by(Log.date.desc()).all()