from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.upload import upload_bp
from routes.search import search_bp
from routes.download import download_bp
from routes.edit import edit_bp
from routes.delete import delete_bp
from db import get_db_connection  # Import from db.py

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "  # Allow content only from the same origin
        "script-src 'self'; "  # Allow scripts only from the same origin
        "style-src 'self'; "  # Allow styles only from the same origin
        "img-src 'self' data:; "  # Allow images from the same origin and inline data
        "object-src 'none'; "  # Disallow plugins like Flash
        "frame-ancestors 'none';"  # Disallow embedding in iframes
    )
    return response

# Register the blueprints/routes
app.register_blueprint(upload_bp)
app.register_blueprint(search_bp)
app.register_blueprint(download_bp)
app.register_blueprint(edit_bp)
app.register_blueprint(delete_bp)

# Route for testing the server
@app.route('/')
def index():
    return 'Flask server is running. Use /upload to POST files.'

if __name__ == '__main__':
    app.run(debug=True)