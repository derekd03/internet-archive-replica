from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from upload import upload_bp
from db import get_db_connection  # Import from db.py

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register the upload blueprint
app.register_blueprint(upload_bp)

# Route for testing the server
@app.route('/')
def index():
    return 'Flask server is running. Use /upload to POST files.'

if __name__ == '__main__':
    app.run(debug=True)