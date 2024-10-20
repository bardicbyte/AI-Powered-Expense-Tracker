from flask import Blueprint, jsonify, request
from datetime import datetime
from PETbackend.models import db
# from PETbackend.models.users import User
# from PETbackend.models.bill_reminders import BillReminder
# from PETbackend.models.financial_goals import FinancialGoal
# from PETbackend.models.budgets import Budget
from PETbackend.models.expenses import Expense
import uuid
import requests

api = Blueprint("api", __name__, url_prefix="/api/v1")

# Health check
@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"message": "Server is healthy"}), 200

# Create budget
@api.route('/budget', methods=['POST'])
def create_budget():
    data = request.json
    new_budget = Budget(
        BudgetID=str(uuid.uuid4()),
        UserID=str(uuid.uuid4()),  # Generate a random UUID
        Name=data['name'],
        StartDate=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        EndDate=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
        TotalAmount=data['total_amount']
    )
    db.session.add(new_budget)
    db.session.commit()
    return jsonify({"message": "Budget created successfully", "budget_id": new_budget.BudgetID}), 201

@api.route('/check-invoice-processor', methods=['GET'])
def check_invoice_processor():
    try:
        response = requests.get('http://invoice_processor:5001/health', timeout=5)
        if response.status_code == 200:
            return jsonify({"status": "Invoice processor is reachable", "details": response.json()}), 200
        else:
            return jsonify({"status": "Invoice processor is reachable but returned an unexpected status", "code": response.status_code}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"status": "Invoice processor is not reachable", "error": str(e)}), 503

# Updated route for processing invoices
@api.route('/process-invoice', methods=['POST'])
def process_invoice():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            # Send the file to the invoice processing service
            invoice_processor_url = "http://invoice_processor:5001/process"  # Update this URL if needed
            files = {'file': (file.filename, file.stream, file.content_type)}
            response = requests.post(invoice_processor_url, files=files)
            
            if response.status_code == 200:
                return jsonify(response.json()), 200
            else:
                return jsonify({"error": "Failed to process invoice"}), 500
        except requests.RequestException as e:
            return jsonify({"error": f"Error connecting to invoice processor: {str(e)}"}), 500

    return jsonify({"error": "Failed to process file"}), 500


@api.route('/expense', methods=['POST'])
def log_expense():
    data = request.json
    
    if 'invoice_data' in data:
        # Process invoice data
        invoice_data = data['invoice_data']
        expenses = []

        # Extract header information
        invoice_date = invoice_data.get('header', {}).get('invoice_date', datetime.now().strftime('%Y-%m-%d'))
        seller = invoice_data.get('header', {}).get('seller', 'Unknown')

        # Process each item as a separate expense
        for item in invoice_data.get('items', []):
            new_expense = Expense(
                ExpenseID=str(uuid.uuid4()),
                ExpenseName=f"{seller} - {item.get('item_name', 'Unknown Item')}",
                ExpenseType='Invoice Item',
                Amount=float(item.get('item_gross_worth', 0)),
                Date=datetime.strptime(invoice_date, '%Y-%m-%d').date(),
               
            )
            expenses.append(new_expense)

        # Add all expenses to the session and commit
        db.session.add_all(expenses)
        db.session.commit()

        return jsonify({
            "message": f"Successfully logged {len(expenses)} expenses from invoice",
            "expense_ids": [expense.ExpenseID for expense in expenses]
        }), 201

    else:
        # Handle manually entered expense (unchanged)
        new_expense = Expense(
            ExpenseID=str(uuid.uuid4()), 
            ExpenseName=data['expense_name'],
            ExpenseType=data['expense_type'],
            Amount=data['amount'],
            Date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"message": "Expense logged successfully", "expense_id": new_expense.ExpenseID}), 201

@api.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([expense.to_dict() for expense in expenses]), 200