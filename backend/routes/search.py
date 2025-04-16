import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '').strip()
    metadata_field = request.args.get('field', '').strip().lower()

    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    valid_fields = ["title", "creator", "description", "subjects", "collection", "language"]
    if metadata_field and metadata_field not in valid_fields:
        return jsonify({"error": f"Invalid field. Valid fields are: {', '.join(valid_fields)}"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if metadata_field:  # If a specific field is provided, use it for the search
            if metadata_field == "collection":
                sql = f"SELECT * FROM files WHERE REPLACE(LOWER(CAST({metadata_field} AS TEXT)), '_', ' ') LIKE %s"
            else:
                sql = f"SELECT * FROM files WHERE LOWER(CAST({metadata_field} AS TEXT)) LIKE %s"
            like_query = f"%{query.lower()}%"
            cursor.execute(sql, (like_query,))
        else:  # If no specific field is provided, search across all fields
            sql = """
            SELECT * FROM files
            WHERE LOWER(CAST(title AS TEXT)) LIKE %s OR LOWER(CAST(creator AS TEXT)) LIKE %s 
                  OR LOWER(CAST(description AS TEXT)) LIKE %s OR LOWER(CAST(subjects AS TEXT)) LIKE %s 
                  OR REPLACE(LOWER(CAST(collection AS TEXT)), '_', ' ') LIKE %s OR LOWER(CAST(language AS TEXT)) LIKE %s
            """ # '_' replaced by ' ' for collection field
            like_query = f"%{query.lower()}%"
            cursor.execute(sql, (like_query, like_query, like_query, like_query, like_query, like_query))

        rows = cursor.fetchall()
        results = [
            {
                "id": str(row[0]),
                "filename": row[1],
                "filepath": row[2],
                "title": row[3],
                "description": row[4],
                "subjects": row[5] or [],
                "creator": row[6],
                "upload_date": row[7].isoformat() if row[7] else None,
                "metadata_date": row[8].isoformat() if row[8] else None,
                "collection": row[9],
                "language": row[10] or "N/A",
                "license": row[11],
            }
            for row in rows
        ]
        return jsonify(results)

    finally:
        cursor.close()
        conn.close()

@search_bp.route('/item/<id>', methods=['GET'])
def get_item_details(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        sql = "SELECT * FROM files WHERE id = %s"
        cursor.execute(sql, (id,))
        row = cursor.fetchone()

        if not row:
            return jsonify({"error": "Item not found"}), 404

        item = {
            "id": str(row[0]),
            "filename": row[1],
            "filepath": row[2],
            "title": row[3],
            "description": row[4],
            "subjects": row[5] or [],
            "creator": row[6],
            "upload_date": row[7].isoformat() if row[7] else None,
            "metadata_date": row[8].isoformat() if row[8] else None,
            "collection": row[9],
            "language": row[10] or "N/A",
            "license": row[11],
        }

        return jsonify(item)

    finally:
        cursor.close()
        conn.close()
