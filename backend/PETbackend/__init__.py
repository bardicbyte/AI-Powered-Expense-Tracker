from os import environ
from flask import Flask
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
 
def create_app(config_overrides=None): 
   app = Flask(__name__) 
   CORS(app) 
 
   app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("SQLALCHEMY_DATABASE_URI", "sqlite:///db.sqlite")
   if config_overrides: 
       app.config.update(config_overrides)
 
   # Load the models 
   from PETbackend.models import db 
   # from PETbackend.models.users import User
   # from PETbackend.models.bill_reminders import BillReminder
   # from PETbackend.models.financial_goals import FinancialGoal
   # from PETbackend.models.budgets import Budget
   from PETbackend.models.expenses import Expense
   db.init_app(app) 
 
   # Create the database tables 
   with app.app_context(): 
      db.create_all() 
      db.session.commit() 
 
   # Register the blueprints 
   from PETbackend.views.routes import api 
   app.register_blueprint(api) 
 
   return app