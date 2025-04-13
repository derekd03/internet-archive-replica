import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# The uploads directory should be created in the root of the project
UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER") or os.path.join(BASE_DIR, '..', 'uploads')
