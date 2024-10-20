from . import db, datetime
import uuid

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    ExpenseID = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # UserID = db.Column(db.String(36), db.ForeignKey('users.UserID'), nullable=False)
    ExpenseName = db.Column(db.String(100), nullable=False)
    ExpenseType = db.Column(db.String(50), nullable=False)
    Amount = db.Column(db.Numeric(10, 2), nullable=False)
    Date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    CreatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    UpdatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'ExpenseID': self.ExpenseID,
            # 'UserID': self.UserID,
            'ExpenseName': self.ExpenseName,
            'ExpenseType': self.ExpenseType,
            'Amount': float(self.Amount),
            'Date': self.Date.isoformat(),
            'CreatedAt': self.CreatedAt.isoformat(),
            'UpdatedAt': self.UpdatedAt.isoformat()
        }