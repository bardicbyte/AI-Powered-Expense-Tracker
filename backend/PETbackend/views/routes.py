from flask import Blueprint, jsonify, request
from datetime import datetime
from PETbackend.models import db
from PETbackend.models.expenses import Expense
import uuid
from decimal import Decimal, InvalidOperation

api = Blueprint("api", __name__, url_prefix="/api/v1")

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@api.route('/expense/manual', methods=['POST'])
def log_manual_expense():
    try:
        # Get JSON data and handle case where request has no JSON
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Validate required fields (removed date from required fields)
        required_fields = ['expense_name', 'expense_type', 'amount']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing_fields
            }), 400

        # Validate data types and formats
        try:
            amount = Decimal(str(data['amount']))
        except InvalidOperation as e:
            return jsonify({
                "error": "Invalid amount format",
                "details": str(e)
            }), 400

        # Create new expense with today's date
        new_expense = Expense(
            ExpenseID=str(uuid.uuid4()),
            ExpenseName=str(data['expense_name']),
            ExpenseType=str(data['expense_type']),
            Amount=amount,
            Date=datetime.utcnow().date()  # Always use today's date
        )

        # Add to database and commit
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({
            "message": "Expense logged successfully",
            "expense_id": new_expense.ExpenseID,
            "expense": new_expense.to_dict()
        }), 201

    except Exception as e:
        # Rollback the session in case of error
        db.session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@api.route('/expense/automatic', methods=['POST'])
def log_automatic_expense():
    try:
        data = request.get_json()
        if not data or 'line_items' not in data:
            return jsonify({"error": "No line items provided"}), 400

        expenses = []
        current_date = datetime.utcnow().date()
        
        # Get store name for the expense description
        store_name = data.get('store_name', 'Unknown Store').strip() or 'Unknown Store'
        
        # Process each line item
        for item in data['line_items']:
            try:
                # Clean and validate the item value
                item_value = item.get('item_value', '0')
                if isinstance(item_value, str):
                    item_value = item_value.replace('$', '').strip()
                
                amount = Decimal(str(item_value))
                quantity = int(item.get('item_quantity', 1))
                
                # Clean up item name - convert to title case for better readability
                item_name = item.get('item_name', 'Unknown Item').strip()
                item_name = ' '.join(item_name.split()).title()
                
                # If quantity is more than 1, add it to the expense name
                expense_name = f"{item_name} x{quantity}" if quantity > 1 else item_name
                
                new_expense = Expense(
                    ExpenseID=str(uuid.uuid4()),
                    ExpenseName=expense_name,
                    ExpenseType='Grocery',  # You can modify this based on your needs
                    Amount=amount * quantity,  # Multiply by quantity
                    Date=current_date
                )
                expenses.append(new_expense)
                
            except (ValueError, InvalidOperation) as e:
                return jsonify({
                    "error": f"Invalid amount format for item {item.get('item_name', 'Unknown Item')}",
                    "details": str(e)
                }), 400

        if not expenses:
            return jsonify({"error": "No valid expenses found in the data"}), 400

        # Add all expenses to database
        db.session.add_all(expenses)
        db.session.commit()

        # Calculate total for verification
        total_amount = sum(float(expense.Amount) for expense in expenses)

        return jsonify({
            "message": f"Successfully logged {len(expenses)} expenses from receipt",
            "expense_ids": [expense.ExpenseID for expense in expenses],
            "expenses": [expense.to_dict() for expense in expenses],
            "total_amount": round(total_amount, 2)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@api.route('/expenses', methods=['GET'])
def get_expenses():
    try:
        expenses = Expense.query.all()
        return jsonify([expense.to_dict() for expense in expenses]), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to retrieve expenses",
            "details": str(e)
        }), 500
    
@api.route('/expenses', methods=['DELETE'])
def delete_all_expenses():
    try:
        # Delete all records from the Expense table
        num_deleted = db.session.query(Expense).delete()
        db.session.commit()
        
        return jsonify({
            "message": f"Successfully deleted {num_deleted} expenses",
            "count": num_deleted
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to delete expenses",
            "details": str(e)
        }), 500