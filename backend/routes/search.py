import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py
import bleach

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
def search():
    # Sanitize query and metadata field inputs
    query = bleach.clean(request.args.get('query', '').strip())
    metadata_field = bleach.clean(request.args.get('field', '').strip().lower())

    # Pagination parameters
    page = int(request.args.get('page', 1))
    page_size = 16  # Number of results per page
    offset = (page - 1) * page_size

    # Validate query parameter
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Validate metadata field if provided
    valid_fields = ["title", "creator", "description", "subjects", "collection", "language"]
    if metadata_field and metadata_field not in valid_fields:
        return jsonify({"error": f"Invalid field. Valid fields are: {', '.join(valid_fields)}"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Construct SQL query based on whether a specific field is provided
        if metadata_field:
            if metadata_field == "collection":
                sql = """
                SELECT * FROM files 
                WHERE REPLACE(LOWER(CAST(collection AS TEXT)), '_', ' ') LIKE %s
                LIMIT %s OFFSET %s
                """
            else:
                sql = f"""
                SELECT * FROM files 
                WHERE LOWER(CAST({metadata_field} AS TEXT)) LIKE %s
                LIMIT %s OFFSET %s
                """
            like_query = f"%{query.lower()}%"
            cursor.execute(sql, (like_query, page_size, offset))
        else:
            # Search across all fields if no specific field is provided
            sql = """
            SELECT * FROM files
            WHERE LOWER(CAST(title AS TEXT)) LIKE %s OR LOWER(CAST(creator AS TEXT)) LIKE %s 
                  OR LOWER(CAST(description AS TEXT)) LIKE %s OR LOWER(CAST(subjects AS TEXT)) LIKE %s 
                  OR REPLACE(LOWER(CAST(collection AS TEXT)), '_', ' ') LIKE %s OR LOWER(CAST(language AS TEXT)) LIKE %s
            LIMIT %s OFFSET %s
            """
            like_query = f"%{query.lower()}%"
            cursor.execute(sql, (like_query, like_query, like_query, like_query, like_query, like_query, page_size, offset))

        # Fetch results and format them as JSON
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
                "upload_date": row[7],
                "collection": row[8],
                "language": row[9] or "N/A",
                "license": row[10],
            }
            for row in rows
        ]
        return jsonify(results)

    finally:
        # Ensure the database connection is closed
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
            "upload_date": row[7],
            "collection": row[8],
            "language": row[9] or "N/A",
            "license": row[10],
            "file_size": row[11] if len(row) > 11 else None,  # Ensure file_size is included
        }

        return jsonify(item)

    finally:
        cursor.close()
        conn.close()
