from flask import Blueprint, current_app, request, jsonify
from PIL import Image
import io
import torch

invoice_processor_bp = Blueprint('invoice_processor', __name__)

@invoice_processor_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@invoice_processor_bp.route('/process', methods=['POST'])
def process_invoice():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # Read the image file
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Preprocess the image
        pixel_values = current_app.processor(image, return_tensors="pt").pixel_values
        pixel_values = pixel_values.to(current_app.config['DEVICE'])
        
        # Generate the output
        outputs = current_app.model.generate(
            pixel_values,
            max_length=512,
            early_stopping=True,
            pad_token_id=current_app.processor.tokenizer.pad_token_id,
            eos_token_id=current_app.processor.tokenizer.eos_token_id,
            use_cache=True,
            num_beams=1,
            bad_words_ids=[[current_app.processor.tokenizer.unk_token_id]],
            return_dict_in_generate=True,
        )
        
        # Decode the output
        sequence = current_app.processor.batch_decode(outputs.sequences)[0]
        sequence = sequence.replace(current_app.processor.tokenizer.eos_token, "").replace(current_app.processor.tokenizer.pad_token, "")
        extracted_info = current_app.processor.token2json(sequence)
        
        return jsonify(extracted_info)

    return jsonify({"error": "Failed to process file"}), 500