import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

@upload_bp.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # Extract metadata from the form
    metadata = {
        'title': request.form.get('title'),
        'description': request.form.get('description'),
        'subjects': request.form.get('subjects', '').split(','),
        'creator': request.form.get('creator'),
        'date': request.form.get('date'),
        'collection': request.form.get('collection'),
        'language': request.form.get('language'),
        'license': request.form.get('license'),
    }

    # Validate metadata
    if not all(metadata.values()):
        return jsonify({'message': 'All fields are required'}), 400

    # Sanitize collection name
    collection = metadata['collection'].replace(" ", "_").lower()
    collection_folder = os.path.join(UPLOAD_FOLDER, collection)
    os.makedirs(collection_folder, exist_ok=True)

    # Save the file
    # Generate a unique file ID (UUID)
    file_id = str(uuid.uuid4())
    file_name = file.filename
    file_path = os.path.join(collection_folder, file_name)
    file.save(file_path)

    # Insert metadata into the database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO files (id, filename, filepath, title, description, subjects, creator, upload_date, collection, language, license)
            VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s)
            """,
            (file_id, file_name, file_path, metadata['title'], metadata['description'], metadata['subjects'],
             metadata['creator'], collection, metadata['language'], metadata['license'])
        )
        conn.commit()
    except Exception as e:
        return jsonify({'message': f'Error saving metadata: {e}'}), 500
    finally:
        cursor.close()

    return jsonify({
        'message': 'File uploaded successfully',
        "file_id": file_id,
    }), 200
