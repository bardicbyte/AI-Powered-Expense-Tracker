from os import environ
from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
 
def create_app(config_overrides=None): 
    app = Flask(__name__) 
    CORS(app) 
 
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("SQLALCHEMY_DATABASE_URI", "sqlite:///db.sqlite")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    if config_overrides: 
        app.config.update(config_overrides)
 
    # Load the models 
    from PETbackend.models import db 
    from PETbackend.models.expenses import Expense
    db.init_app(app) 
 
    # Create the database tables 
    with app.app_context(): 
        # Drop all tables first to ensure clean slate
        db.drop_all()
        # Create all tables with new schema
        db.create_all()
        db.session.commit() 
 
    # Register the blueprints 
    from PETbackend.views.routes import api 
    app.register_blueprint(api) 
 
    return app