import os
import bleach
from flask import Blueprint, jsonify, send_file
from db import get_db_connection  # Import from db.py

download_bp = Blueprint('download', __name__)

@download_bp.route('/download/<uuid:file_id>', methods=['GET'])
def download(file_id):
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch the file path from the database using the file ID
    cursor.execute("SELECT filename, filepath FROM files WHERE id = %s", (str(file_id),))
    file_record = cursor.fetchone()
    cursor.close()
    conn.close()

    if not file_record:
        return jsonify({"error": "File not found"}), 404

    filename, file_path = file_record

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({"message": "File not found"}), 404

    # Send the file to the client
    return send_file(file_path, as_attachment=True)