# Fraud Detection using Logistic Regression with SMOTE

This project is focused on detecting fraudulent transactions using a Logistic Regression model. The dataset contains a mix of categorical and numerical features describing transactions. We use SMOTE (Synthetic Minority Over-sampling Technique) to address class imbalance, scaling to normalize the data, and Logistic Regression as the main classification model.

## Table of Contents
- [Dataset](#dataset)
- [Project Workflow](#project-workflow)
- [Data Preprocessing](#data-preprocessing)
- [Oversampling using SMOTE](#oversampling-using-smote)
- [Model Selection and Performance](#model-selection-and-performance)
- [Save Model and Scaler](#save-model-and-scaler)
- [Evaluation](#evaluation)
- [Conclusion](#conclusion)

## Dataset
The dataset used in this project is `fictitious_payments_txn_dataset(in).csv`, containing transaction data with several features:
- `sending_bank`, `receiving_bank`: Categorical features indicating the banks involved in the transaction.
- `sending_account_number`, `receiving_account_number`: Numerical account identifiers.
- `merchant_channel`: The channel used for payment.
- `payment_type`: Type of transaction.
- `amount`: The transaction amount.
- `fraud`: The target label, where 1 indicates a fraudulent transaction, and 0 indicates a non-fraudulent one.

## Project Workflow
1. Load and preprocess data.
2. Encode categorical features and scale numerical features.
3. Apply SMOTE to handle the imbalance in fraud data.
4. Train a Logistic Regression model.
5. Evaluate model performance.
6. Save the trained model and scaler for later use.

## Data Preprocessing
1. **Label Encoding**: The `merchant_channel` column is transformed into a numerical format using LabelEncoder to prepare it for Logistic Regression.
2. **One-Hot Encoding**: Categorical features are transformed into dummy variables to avoid an ordinal assumption.
3. **Scaling**: We use `StandardScaler` to standardize features, ensuring they contribute equally to the model’s decision.

## Oversampling using SMOTE
Since the dataset is highly imbalanced (fraudulent transactions are much fewer than non-fraudulent ones), we use **SMOTE** to oversample the minority class. This helps our model learn the characteristics of fraud transactions better and improves recall for fraud detection.

## Model Selection and Performance
We evaluated several models for comparison, including Logistic Regression, K-Neighbors Classifier, SVC, and Decision Tree. Here’s a summary of the accuracy results:

| Model                  | Accuracy | Fraud Recall | Fraud Precision |
|------------------------|----------|--------------|-----------------|
| Logistic Regression    | 0.77     | 0.96         | 1.00           |
| K-Neighbors Classifier | 1.00     | 0.01         | 0.00           |
| SVC                    | 0.98     | 0.04         | 0.00           |
| Decision Tree          | 1.00     | 0.51         | 0.28           |

### Key Insights
- **Logistic Regression** achieved balanced accuracy with high recall for fraud detection when combined with SMOTE, making it effective for detecting rare fraudulent transactions.
- **K-Neighbors, SVC, and Decision Tree** models achieved high accuracy but showed poor recall for the fraud class due to class imbalance, failing to detect fraudulent transactions effectively.

Based on these results, **Logistic Regression** is selected as it offers the best balance between fraud detection precision and recall after applying SMOTE. Logistic Regression’s simplicity and interpretability make it especially valuable in fraud detection applications, where understanding model decisions is crucial.

## Save Model and Scaler
To facilitate model deployment, we save the trained model and scaler:
```python
import joblib
joblib.dump(log_reg_sm, "model/logistic_regression_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
```

## Evaluation
The model's confusion matrix and accuracy score reveal its performance on detecting fraudulent transactions. Logistic Regression with SMOTE provided better recall for fraud detection and reduced false negatives, balancing detection accuracy effectively.

## Conclusion
Using Logistic Regression with SMOTE improves fraud detection in an imbalanced dataset. The model’s balance between precision and recall, along with interpretability, makes it ideal for fraud detection scenarios.