from . import db
import uuid
from datetime import datetime

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    ExpenseID = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ExpenseName = db.Column(db.String(100), nullable=False)
    ExpenseType = db.Column(db.String(50), nullable=False)
    Amount = db.Column(db.Numeric(10, 2), nullable=False)
    Date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)

    def to_dict(self):
        return {
            'ExpenseID': self.ExpenseID,
            'ExpenseName': self.ExpenseName,
            'ExpenseType': self.ExpenseType,
            'Amount': float(self.Amount),
            'Date': self.Date.isoformat()
        }