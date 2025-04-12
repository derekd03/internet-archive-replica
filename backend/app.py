from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from upload import upload_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register upload route
app.register_blueprint(upload_bp)

@app.route('/')
def index():
    return 'Flask server is running. Use /upload to POST files.'

if __name__ == '__main__':
    app.run(debug=True)