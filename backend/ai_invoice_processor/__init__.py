from os import environ
from flask import Flask
from flask_cors import CORS
from transformers import DonutProcessor, VisionEncoderDecoderModel
import torch

def create_app(config_overrides=None):
    app = Flask(__name__)
    CORS(app)

    # Configuration
    app.config['MODEL_PATH'] = environ.get("MODEL_PATH", "mychen76/invoice-and-receipts_donut_v1")
    app.config['DEVICE'] = "cuda" if torch.cuda.is_available() else "cpu"
    
    if config_overrides:
        app.config.update(config_overrides)

    # Load the Donut model and processor
    with app.app_context():
        app.processor = DonutProcessor.from_pretrained(app.config['MODEL_PATH'])
        app.model = VisionEncoderDecoderModel.from_pretrained(app.config['MODEL_PATH'])
        app.model.to(app.config['DEVICE'])

    # Register the blueprint
    from .routes import invoice_processor_bp
    app.register_blueprint(invoice_processor_bp)

    return app