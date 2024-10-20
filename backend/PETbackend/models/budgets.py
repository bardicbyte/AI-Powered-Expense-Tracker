from . import db, datetime
import uuid

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    BudgetID = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    UserID = db.Column(db.String(36), db.ForeignKey('users.UserID'), nullable=False)
    Name = db.Column(db.String(100), nullable=False)
    StartDate = db.Column(db.Date, nullable=False)
    EndDate = db.Column(db.Date, nullable=False)
    TotalAmount = db.Column(db.Numeric(10, 2), nullable=False)
    CreatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    UpdatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'BudgetID': self.BudgetID,
            'UserID': self.UserID,
            'Name': self.Name,
            'StartDate': self.StartDate.isoformat(),
            'EndDate': self.EndDate.isoformat(),
            'TotalAmount': float(self.TotalAmount),
            'CreatedAt': self.CreatedAt.isoformat(),
            'UpdatedAt': self.UpdatedAt.isoformat()
        }