from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# Database credentials
DB_NAME = "pocdb"
DB_USER = "pocuserpg"
DB_PASSWORD = "pocpasspg"
DB_HOST = "127.0.0.1"
DB_PORT = "5435"

# SQLAlchemy Database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

def test_connection():
    try:
        conn = psycopg2.connect(
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        conn.close()
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False


def get_db_connection():
    conn = psycopg2.connect(
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        cursor_factory=RealDictCursor
    )
    return conn

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the Flask API!'})

if __name__ == '__main__':
    if test_connection():
        print("Database connection successful!")
        with app.app_context():
            db.create_all()
        app.run(debug=True)
    else:
        print("Failed to connect to the database. Check your credentials.")