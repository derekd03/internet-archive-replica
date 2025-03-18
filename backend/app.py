from flask import Flask, request, jsonify
import psycopg2
from minio import Minio
from elasticsearch import Elasticsearch
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Debug: Print environment variables
print("POSTGRES_HOST:", os.getenv('POSTGRES_HOST'))
print("MINIO_ENDPOINT:", os.getenv('MINIO_ENDPOINT'))
print("ELASTICSEARCH_HOST:", os.getenv('ELASTICSEARCH_HOST'))

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=os.getenv('POSTGRES_HOST'),
    database=os.getenv('POSTGRES_DB'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD')
)

# Connect to Minio
minioClient = Minio(
    os.getenv('MINIO_ENDPOINT'),  # Use MINIO_ENDPOINT instead of MINIO_HOST
    access_key=os.getenv('MINIO_ACCESS_KEY'),
    secret_key=os.getenv('MINIO_SECRET_KEY'),
    secure=False
)

# Connect to Elasticsearch
es = Elasticsearch([os.getenv('ELASTICSEARCH_HOST')])

# Create table
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    file_name = file.filename
    file_path = f'uploads/{file_name}'
    file.save(file_path)

    minioClient.fput_object('uploads', file_name, file_path)

    return jsonify({'message': 'File uploaded successfully'})

# Search file
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')

    body = {
        'query': {
            'match': {
                'content': query
            }
        }
    }

    res = es.search(index='files', body=body)

    return jsonify(res['hits']['hits'])

if __name__ == '__main__':
    app.run(debug=True)