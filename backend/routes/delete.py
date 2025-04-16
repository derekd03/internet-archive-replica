import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py
import bleach

delete_bp = Blueprint('delete', __name__)

@delete_bp.route('/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    if not file_id:
        return jsonify({"error": "File ID is required"}), 400

    # Sanitize file_id
    file_id = bleach.clean(file_id)

    # Validate file_id as a UUID
    try:
        uuid.UUID(file_id)
    except ValueError:
        return jsonify({"error": "Invalid File ID format"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch the file path from the database
    cursor.execute("SELECT filepath FROM files WHERE id = %s", (file_id,))
    row = cursor.fetchone()

    if row is None:
        cursor.close()
        conn.close()
        return jsonify({"error": "File not found"}), 404

    file_path = row[0]

    # Delete the file from the filesystem
    try:
        os.remove(file_path)
    except OSError as e:
        cursor.close()
        conn.close()
        return jsonify({"error": f"Error deleting file: {str(e)}"}), 500

    # Delete the file record from the database
    cursor.execute("DELETE FROM files WHERE id = %s", (file_id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "File deleted successfully"}), 200