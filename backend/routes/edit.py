import os
import shutil
import bleach
from flask import Blueprint, request, jsonify
from db import get_db_connection

edit_bp = Blueprint('edit', __name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

@edit_bp.route('/edit/<file_id>', methods=['PUT'])
def edit_file(file_id):
    data = request.get_json()

    # Extract metadata
    metadata = {
        'title': bleach.clean(data.get('title')),
        'description': bleach.clean(data.get('description')),
        'subjects': [bleach.clean(subject) for subject in data.get('subjects', [])],
        'creator': bleach.clean(data.get('creator')),
        'collection': bleach.clean(data.get('collection')),
        'language': bleach.clean(data.get('language')),
        'license': bleach.clean(data.get('license')),
    }

    # Validate required fields
    required_fields = ['title', 'description', 'subjects', 'collection']
    missing_fields = [field for field in required_fields if not metadata.get(field)]
    if missing_fields:
        return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Sanitize collection name
    new_collection = metadata['collection'].replace(" ", "_").lower()
    new_collection_folder = os.path.join(UPLOAD_FOLDER, new_collection)
    os.makedirs(new_collection_folder, exist_ok=True)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get current collection
        cursor.execute("SELECT collection FROM files WHERE id = %s", (file_id,))
        result = cursor.fetchone()
        if not result:
            return jsonify({'message': 'File not found'}), 404

        current_collection = result[0].replace(" ", "_").lower()
        if current_collection != new_collection:
            current_folder = os.path.join(UPLOAD_FOLDER, current_collection, file_id)
            new_folder = os.path.join(new_collection_folder, file_id)
            shutil.move(current_folder, new_folder)

    except Exception as e:
        return jsonify({'message': f'Error handling collection folders: {e}'}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Update metadata using parameterized query
        cursor.execute("""
            UPDATE files
            SET title = %s,
                description = %s,
                subjects = %s,
                creator = %s,
                collection = %s,
                language = %s,
                license = %s
            WHERE id = %s
        """, (
            metadata['title'],
            metadata['description'],
            metadata['subjects'],
            metadata['creator'],
            new_collection,
            metadata['language'],
            metadata['license'],
            file_id
        ))

        conn.commit()
    except Exception as e:
        return jsonify({'message': f'Error updating metadata: {e}'}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

    return jsonify({'message': 'File metadata updated successfully'}), 200
