import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# Instantiate a LabelEncoder
le = LabelEncoder()

df = pd.read_csv("data/fictitious_payments_txn_dataset(in).csv")
# df.head()

# Preprocess dataset
# Selecting feature columns and target column
X = df[
    [
        "sending_bank",
        "sending_account_number",
        "receiving_bank",
        "receiving_account_number",
        "merchant_channel",
        "payment_type",
        "amount",
    ]
]
y = df["fraud"]

# Apply Label Encoding to the 'merchant_channel' column
X["merchant_channel"] = le.fit_transform(X["merchant_channel"])
# Change categorical features to dummy variables
X = pd.get_dummies(X, columns=["merchant_channel"])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Scale the data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Apply SMOTE for oversampling
sm = SMOTE(random_state=42)
X_sm, y_sm = sm.fit_resample(X_train_scaled, y_train)

# Logistic Regression
log_reg_sm = LogisticRegression(random_state=42)
log_reg_sm.fit(X_sm, y_sm)

y_pred_log_reg = log_reg_sm.predict(X_test_scaled)

log_reg_cf = confusion_matrix(y_test, y_pred_log_reg)


# Logistic Regression with SMOTE Technique (Better accuracy with SMOTE)
y_pred_sm = log_reg_sm.predict(X_test_scaled)
oversample_score = accuracy_score(y_test, y_pred_sm)

import joblib

# บันทึกโมเดล Logistic Regression ที่ผ่านการฝึกสอนแล้ว
joblib.dump(log_reg_sm, "model/logistic_regression_model.pkl")
# บันทึก Scaler
joblib.dump(scaler, "model/scaler.pkl")
