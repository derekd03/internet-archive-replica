import os
import uuid
from flask import Blueprint, request, jsonify
from db import get_db_connection  # Import from db.py

DEFAULT_THUMBNAIL = "/public/default.png"

search_bp = Blueprint('search', __name__)

@search_bp.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify([]) 

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = """
    SELECT * FROM files
    WHERE LOWER(title) LIKE %s OR LOWER(creator) LIKE %s OR LOWER(description) LIKE %s
    """

    like_query = f"%{query.lower()}%"
    cursor.execute(sql, (like_query, like_query, like_query))
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
            "imageUrl": DEFAULT_THUMBNAIL,
        }
        for row in rows
    ]
    
    cursor.close()
    conn.close()

    return jsonify(results)