import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py
from config import UPLOAD_FOLDER

upload_bp = Blueprint('upload', __name__)

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

    # Validate required fields
    required_fields = ['title', 'description', 'subjects', 'collection']
    missing_fields = [field for field in required_fields if not metadata.get(field)]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Sanitize collection name
    collection = metadata['collection'].replace(" ", "_").lower()
    collection_folder = os.path.join(UPLOAD_FOLDER, collection)
    os.makedirs(collection_folder, exist_ok=True)

    # Save the file
    # Generate a unique file ID (UUID)
    file_id = str(uuid.uuid4())
    file_name = file.filename

    # Ensure the filename is unique within the collection (by UUID)
    uuid_folder = os.path.join(collection_folder, file_id)
    os.makedirs(uuid_folder, exist_ok=True)

    # Save the file with the UUID as the folder name
    file_path = os.path.join(uuid_folder, file.filename)
    file.save(file_path)

    # Convert subjects list to comma-separated string
    subjects_str = ','.join(metadata['subjects'])

    # Insert metadata into the database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Convert subjects list into a PostgreSQL array (using curly braces)
        subjects_array = '{' + ','.join(metadata['subjects']) + '}'

        cursor.execute(
            """
            INSERT INTO files (id, filename, filepath, title, description, subjects, creator, upload_date, collection, language, license)
            VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s, %s, %s)
            """,
            (file_id, file_name, file_path, metadata['title'], metadata['description'],
            subjects_array, metadata['creator'], collection, metadata['language'], metadata['license'])
        )
        conn.commit()
    except Exception as e:
        print(f"Error during upload: {e}")  # Log to console
        return jsonify({'message': f'Error saving metadata: {e}'}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        'message': 'File uploaded successfully',
        "file_id": file_id,
    }), 200
