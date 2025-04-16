# internet-archive-replica (how to run)
 
1. Create ".env" in backend/

Add:
CONNECTION_STRING="your connection string here"

2. Run backend/db.py

3. To run the project (from the root directory)
    i. Launch the Flask server "python backend/app.py" 
    ii. Launch the React App in another terminal "npm run start"

# Codebase

```text
.
├── backend
│   ├── routes                # Flask API endpoints
│   │   ├── __init__.py
│   │   ├── delete.py         # Delete an uploaded item
│   │   ├── download.py       # Serve file downloads
│   │   ├── edit.py           # Edit metadata of an item
│   │   ├── search.py         # Search through uploaded items
│   │   └── upload.py         # Handle new uploads
│   ├── app.py                # Flask app entry point
│   ├── config.py             # App configuration (really only automatically creates uploads)
│   ├── db.py                 # DB connection + table creation
│   └── setup.sql             # Initial DB schema
├── frontend
│   ├── public
│   │   ├── assets            # Custom static files (e.g. icons/images)
│   │   └── ...               # Other public files like index.html, manifest
│   ├── src
│   │   ├── components        # Reusable UI components
│   │   ├── pages             # Page-level components
│   │   ├── utils             # Helper functions
│   │   └── ...               # App.js, index.js, styles, etc.
│   └── ...                   # package.json, README, etc.
├── LICENSE
└── README.md
```
