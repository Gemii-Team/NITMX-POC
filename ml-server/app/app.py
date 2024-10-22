from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import psycopg2
from psycopg2.extras import RealDictCursor
import joblib
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from uuid import uuid4

app = Flask(__name__)

le = LabelEncoder()
scaler = None
model = None

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

# Route to make predictions
@app.route("/predict", methods=["POST"])
def predict():
    global scaler, model

    # Load model, scaler, and columns if not already loaded
    if model is None:
        model = joblib.load("model/logistic_regression_model.pkl")
    if scaler is None:
        scaler = joblib.load("model/scaler.pkl")

    # Load the columns used during training
    columns = joblib.load("model/columns.pkl")

    # Get JSON data from request
    data = request.get_json()
    df = pd.DataFrame([data])  # Wrap data in a list to ensure a single row DataFrame

    # Preprocess input data
    df["merchant_channel"] = le.fit_transform(df["merchant_channel"])
    df = pd.get_dummies(df, columns=["merchant_channel"])

    # Reindex to ensure the same columns as in training
    df = df.reindex(columns=columns, fill_value=0)

    # Scale the data
    df_scaled = scaler.transform(df)

    # Make predictions
    predictions = model.predict(df_scaled)
    prediction_accuracy = model.score(df_scaled, predictions)
    id = uuid4()
    if predictions[0] == 1:
        # If the prediction is 1, the transaction is fraudulent
        con = get_db_connection()
        cur = con.cursor()
        cur.execute("""INSERT INTO stagging (sending_bank, sending_account_number, receiving_bank, receiving_account_number, merchant_channel, payment_type, amount, id, fraude, acc) VALUES (%s, %s, %s, %s ,%s , %s, %s, %s, %s, %s)"""
                    , (data['sending_bank'], data['sending_account_number'], data['receiving_bank'], data['receiving_account_number'], data['merchant_channel'], data['payment_type'], data['amount'], id, 1, prediction_accuracy))
        con.commit()
        con.close()
        # api send mail from go lang to the user

    else:
        con = get_db_connection()
        cur = con.cursor()
        cur.execute("""INSERT INTO stagging (sending_bank, sending_account_number, receiving_bank, receiving_account_number, merchant_channel, payment_type, amount, id, fraude, acc) VALUES (%s, %s, %s, %s ,%s , %s, %s, %s, %s, %s)"""
                    , (data['sending_bank'], data['sending_account_number'], data['receiving_bank'], data['receiving_account_number'], data['merchant_channel'], data['payment_type'], data['amount'], id, 0, prediction_accuracy))
        con.commit()
        con.close()

    return jsonify(
        {"predictions": predictions.tolist(), "accuracy": prediction_accuracy}
    )


if __name__ == '__main__':
    if test_connection():
        print("Database connection successful!")
        with app.app_context():
            db.create_all()
        app.run(debug=True)
    else:
        print("Failed to connect to the database. Check your credentials.")