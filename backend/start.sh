#!/bin/bash

# Start Redis in background
redis-server --daemonize yes

# Start Celery worker in background
poetry run celery -A ai_invoice_processor.celery worker --loglevel=info &

# Start Flask application with Gunicorn
poetry run gunicorn --bind 0.0.0.0:8001 "ai_invoice_processor:create_app()"