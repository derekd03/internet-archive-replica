import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection parameters
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

# Check if the connection string is set
if not CONNECTION_STRING:
    raise ValueError("CONNECTION_STRING environment variable is not set.")

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(CONNECTION_STRING)
    return conn

def execute_sql_file(file_path):
    """Execute SQL commands from a file."""
    with open(file_path, 'r') as file:
        sql_commands = file.read()

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(sql_commands)
        conn.commit()
    except Exception as e:
        print(f"Error executing SQL commands: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    sql_file_path = os.path.join(os.path.dirname(__file__), 'setup.sql')
    execute_sql_file(sql_file_path)