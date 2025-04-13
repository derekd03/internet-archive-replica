from flask import Flask
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