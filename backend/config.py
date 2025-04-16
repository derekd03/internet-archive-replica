import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER") or os.path.join(PROJECT_ROOT, 'uploads')

# Ensure the folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
