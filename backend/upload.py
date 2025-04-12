import os
import uuid
from flask import Blueprint, request, jsonify

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

@upload_bp.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    collection = request.form.get('collection', '').strip()
    if not collection:
        return jsonify({'message': 'Collection is required'}), 400

    # Sanitize collection name
    collection = collection.replace(" ", "_").lower()
    collection_folder = os.path.join(UPLOAD_FOLDER, collection)
    os.makedirs(collection_folder, exist_ok=True)

    file_id = str(uuid.uuid4())
    file_name = file.filename
    file_path = os.path.join(collection_folder, file_name)
    file.save(file_path)

    return jsonify({
        'message': 'File uploaded successfully',
        "file_id": file_id,
    }), 200
