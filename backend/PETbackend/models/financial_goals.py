from . import db, datetime
import uuid

class FinancialGoal(db.Model):
    __tablename__ = 'financial_goals'
    
    GoalID = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    UserID = db.Column(db.String(36), db.ForeignKey('users.UserID'), nullable=False)
    GoalName = db.Column(db.String(100), nullable=False)
    TargetAmount = db.Column(db.Numeric(10, 2), nullable=False)
    CurrentAmount = db.Column(db.Numeric(10, 2), default=0)
    StartDate = db.Column(db.Date, nullable=False, default=datetime.utcnow().date)
    TargetDate = db.Column(db.Date, nullable=False)
    Category = db.Column(db.String(50))  # e.g., 'Savings', 'Investment', 'Debt Repayment'
    Priority = db.Column(db.Integer)  # e.g., 1 for high priority, 3 for low priority
    Status = db.Column(db.String(20), default='In Progress')  # 'In Progress', 'Completed', 'Abandoned'
    Notes = db.Column(db.Text)
    CreatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    UpdatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'GoalID': self.GoalID,
            'UserID': self.UserID,
            'GoalName': self.GoalName,
            'TargetAmount': float(self.TargetAmount),
            'CurrentAmount': float(self.CurrentAmount),
            'StartDate': self.StartDate.isoformat(),
            'TargetDate': self.TargetDate.isoformat(),
            'Category': self.Category,
            'Priority': self.Priority,
            'Status': self.Status,
            'Notes': self.Notes,
            'CreatedAt': self.CreatedAt.isoformat(),
            'UpdatedAt': self.UpdatedAt.isoformat()
        }

    def calculate_progress(self):
        return (self.CurrentAmount / self.TargetAmount) * 100 if self.TargetAmount > 0 else 0

    def days_remaining(self):
        return (self.TargetDate - datetime.utcnow().date()).days

    def is_on_track(self):
        if self.days_remaining() <= 0:
            return self.CurrentAmount >= self.TargetAmount
        expected_progress = (datetime.utcnow().date() - self.StartDate).days / (self.TargetDate - self.StartDate).days
        actual_progress = self.CurrentAmount / self.TargetAmount
        return actual_progress >= expected_progress