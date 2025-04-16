import os
import uuid
import bleach
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py
from config import UPLOAD_FOLDER

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload():
    # Check if a file is included in the request
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # Extract metadata from the form and sanitize inputs
    metadata = {
        'title': bleach.clean(request.form.get('title')),
        'description': bleach.clean(request.form.get('description')),
        'subjects': [bleach.clean(subject) for subject in request.form.get('subjects', '').split(',')],
        'creator': bleach.clean(request.form.get('creator')),
        'collection': bleach.clean(request.form.get('collection')),
        'language': bleach.clean(request.form.get('language')),
        'license': bleach.clean(request.form.get('license')),
    }

    # Validate required fields
    required_fields = ['title', 'description', 'subjects', 'collection']
    missing_fields = [field for field in required_fields if not metadata.get(field)]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Create a folder for the collection if it doesn't exist
    collection = metadata['collection'].replace(" ", "_").lower()
    collection_folder = os.path.join(UPLOAD_FOLDER, collection)
    os.makedirs(collection_folder, exist_ok=True)

    # Generate a unique file ID and save the file
    file_id = str(uuid.uuid4())
    uuid_folder = os.path.join(collection_folder, file_id)
    os.makedirs(uuid_folder, exist_ok=True)
    file_path = os.path.join(uuid_folder, file.filename)
    file.save(file_path)

    # Calculate file size in bytes
    file_size = os.path.getsize(file_path)

    # Check if file size exceeds the maximum allowed limit
    MAX_GB = 2 * 1024 * 1024 * 1024  # 2 GB
    if file_size > MAX_GB:
        return jsonify({'message': 'File size exceeds the maximum allowed limit'}), 400

    # Insert metadata and file size into the database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO files (id, filename, filepath, title, description, subjects, creator, upload_date, collection, language, license, file_size)
            VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s, %s)
            """,
            (
                file_id,
                file.filename,
                file_path,
                metadata['title'],
                metadata['description'],
                metadata['subjects'],
                metadata['creator'],
                collection,
                metadata['language'],
                metadata['license'],
                file_size,
            )
        )
        conn.commit()
    except Exception as e:
        # Log the error and return a failure response
        print(f"Error during upload: {e}")
        return jsonify({'message': f'Error saving metadata: {e}'}), 500
    finally:
        cursor.close()
        conn.close()

    # Return a success response with the file ID and size
    return jsonify({
        'message': 'File uploaded successfully',
        "file_id": file_id,
        "file_size": file_size,
    }), 200
