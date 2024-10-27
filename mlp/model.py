import pandas as pd
import numpy as np
from category_encoders import CatBoostEncoder
from sklearn.model_selection import train_test_split
from catboost import CatBoostClassifier
import lightgbm as lgb
from xgboost import XGBClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import f1_score, roc_auc_score, precision_score, recall_score, classification_report
import joblib  # для сохранения и загрузки моделей
import shap

# Функция для загрузки и обработки данных
def load_and_prepare_data(filename='processed_data.csv', target='erly_pnsn_flg'):
    df = pd.read_csv(filename, encoding='utf-8')
    X = df.drop(columns=[target])
    y = df[target]
    return train_test_split(X, y, test_size=0.2, random_state=42)

# Функция для оценки модели
def evaluate_model(y_test, y_pred, y_pred_proba, model_name):
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    gini = 2 * roc_auc - 1
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)

    print(f"\n--- {model_name} ---")
    print(f"F1: {f1:.2f}")
    print(f"ROC AUC: {roc_auc:.2f}")
    print(f"Gini: {gini:.2f}")
    print(f"Precision: {precision:.2f}")
    print(f"Recall: {recall:.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

# Загрузка и разделение данных
X_train, X_test, y_train, y_test = load_and_prepare_data()

# Категориальные и числовые признаки
categorical_columns = ['location', 'addrss_type', 'prvs_npf', 'brth_plc', 'okato', "gndr", "lk", 'accnt_bgn_date', 'pstl_code', 'cprtn_prd_d', 'prsnt_age', 'pnsn_age']
X_train_catboost = X_train.copy()
X_test_catboost = X_test.copy()

# Преобразование категориальных данных для CatBoost
for col in categorical_columns:
    X_train_catboost[col] = X_train_catboost[col].astype(str)
    X_test_catboost[col] = X_test_catboost[col].astype(str)

# Кодирование категориальных признаков для других моделей
encoder = CatBoostEncoder(cols=categorical_columns)
X_train_encoded = encoder.fit_transform(X_train, y_train)
X_test_encoded = encoder.transform(X_test)

# Обучение и сохранение моделей
models = {}

# 1. CatBoost
model_catboost = CatBoostClassifier(iterations=100, learning_rate=0.1, depth=3, cat_features=categorical_columns, loss_function='Logloss', verbose=False)
model_catboost.fit(X_train_catboost, y_train)
y_pred_catboost = model_catboost.predict(X_test_catboost)
y_pred_proba_catboost = model_catboost.predict_proba(X_test_catboost)[:, 1]
evaluate_model(y_test, y_pred_catboost, y_pred_proba_catboost, "CatBoost")
models['CatBoost'] = model_catboost

# 2. LightGBM
model_lgbm = lgb.LGBMClassifier(n_estimators=200, learning_rate=0.1, max_depth=6)
model_lgbm.fit(X_train_encoded, y_train)
y_pred_lgbm = model_lgbm.predict(X_test_encoded)
y_pred_proba_lgbm = model_lgbm.predict_proba(X_test_encoded)[:, 1]
evaluate_model(y_test, y_pred_lgbm, y_pred_proba_lgbm, "LightGBM")
models['LightGBM'] = model_lgbm

# 3. XGBoost
model_xgb = XGBClassifier(n_estimators=200, learning_rate=0.1, max_depth=6, use_label_encoder=False, eval_metric='logloss')
model_xgb.fit(X_train_encoded, y_train)
y_pred_xgb = model_xgb.predict(X_test_encoded)
y_pred_proba_xgb = model_xgb.predict_proba(X_test_encoded)[:, 1]
evaluate_model(y_test, y_pred_xgb, y_pred_proba_xgb, "XGBoost")
models['XGBoost'] = model_xgb

# 4. Decision Tree
model_tree = DecisionTreeClassifier(max_depth=6, random_state=42)
model_tree.fit(X_train_encoded, y_train)
y_pred_tree = model_tree.predict(X_test_encoded)
y_pred_proba_tree = model_tree.predict_proba(X_test_encoded)[:, 1]
evaluate_model(y_test, y_pred_tree, y_pred_proba_tree, "Decision Tree")
models['DecisionTree'] = model_tree

# Сохранение всех моделей
for model_name, model in models.items():
    joblib.dump(model, f"{model_name}.joblib")
    print(f"{model_name} сохранена в файл {model_name}.joblib")

# Анализ SHAP для CatBoost
explainer = shap.TreeExplainer(model_catboost)
shap_values = explainer.shap_values(X_test_catboost)

# Визуализация важности признаков
shap.summary_plot(shap_values, X_test_catboost, plot_type="bar")  # Bar-график
shap.summary_plot(shap_values, X_test_catboost)  # График важности признаков

# Проверка результата на новой выборке
def check_new_data(new_data_filename, model_name):
    # Загрузка новой выборки
    new_data = pd.read_csv(new_data_filename, encoding='utf-8')
    
    # Обработка новой выборки (аналогично обучающим данным)
    for col in categorical_columns:
        new_data[col] = new_data[col].astype(str)

    # Кодирование категориальных признаков
    new_data_encoded = encoder.transform(new_data)

    # Загрузка модели
    model = joblib.load(f"{model_name}.joblib")

    # Получение предсказаний
    y_pred_new = model.predict(new_data_encoded)
    y_pred_proba_new = model.predict_proba(new_data_encoded)[:, 1]
    
    return y_pred_new, y_pred_proba_new

# Пример использования функции для проверки новой выборки
# new_data_filename = 'new_data.csv'  # Путь к файлу с новой выборкой
# model_name = 'CatBoost'  # Название модели
# predictions, probabilities = check_new_data(new_data_filename, model_name)

# print("Предсказания:", predictions)
# print("Вероятности:", probabilities)
