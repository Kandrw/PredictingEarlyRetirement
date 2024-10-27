import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sb
from catboost import CatBoostClassifier, Pool
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.metrics import f1_score, roc_auc_score, precision_score, recall_score, classification_report
from ydata_profiling import ProfileReport
from category_encoders import CatBoostEncoder
import shap
import xgboost as xgb
import lightgbm as lgb
from xgboost import XGBClassifier
from sklearn.tree import DecisionTreeClassifier


FP1 = 'test_data/trnsctns_ops_tst.csv'

FP2 = 'test_data/cntrbtrs_clnts_ops_tst.csv'

FP3 = 'processed_data.csv'

FP4 = 'test_data/sample_submission.csv'


# Чтение CSV-файла в исходной кодировке, например 'cp1251'
df = pd.read_csv(FP1)

# Сохранение в новой кодировке, например 'utf-8'
df.to_csv(FP1, encoding='utf-8', index=False)

# Чтение CSV-файла в исходной кодировке, например 'cp1251'
df = pd.read_csv(FP2)

# Сохранение в новой кодировке, например 'utf-8'
df.to_csv(FP2, encoding='utf-8', index=False)

df = pd.read_csv(FP2,encoding="utf-8")
#df = df.drop(columns=['Unnamed: 0'], errors='ignore')
#df = df.drop_duplicates()
#df = df.dropna()
df= df.drop(columns=['clnt_id','accnt_id'], errors='ignore')

# Проверяем наличие целевой переменной
target = 'erly_pnsn_flg'
if target not in df.columns:
    raise KeyError(f"Целевая переменная '{target}' не найдена в DataFrame.")

# Определяем категориальные и бинарные столбцы
categorical_columns = ['rgn', 'dstrct', 'city', 'sttlmnt', 'addrss_type', 'prvs_npf', 'brth_plc', 'okato']
binary_columns = ["gndr", "lk"]
additional_columns = ['accnt_bgn_date', 'pstl_code', 'cprtn_prd_d', 'prsnt_age', 'pnsn_age']

# Этап 3: Предварительная обработка данных
df.replace({'******': np.nan}, inplace=True)  # Заменяем '******' на NaN
df.replace({'': np.nan}, inplace=True)  # Заменяем пустые строки на NaN

# Преобразование бинарных данных в числовой формат (1 и 0)
df['gndr'] = df['gndr'].map({'м': 1, 'ж': 0}).fillna(0)  # Заполняем NaN 0
df['lk'] = df['lk'].map({'да': 1, 'нет': 0}).fillna(0)  # Заполняем NaN 0

# Заполнение NaN в категориальных столбцах значением 'missing' и преобразуем их в строки
for column in categorical_columns:
    df[column] = df[column].fillna("missing").astype(str)

# Обработка даты `accnt_bgn_date`: преобразуем в год
df['accnt_bgn_date'] = pd.to_datetime(df['accnt_bgn_date'], errors='coerce')
df['accnt_bgn_year'] = df['accnt_bgn_date'].dt.year.fillna(0).astype(int)

# Обрезка `okato` до первых двух символов и преобразование в строку
df['okato'] = df['okato'].astype(str).str[:2]

# Этап 4: Объединение колонок
df['location'] = df[['rgn', 'dstrct', 'city', 'sttlmnt']].agg('-'.join, axis=1)  # Объединяем в одну колонку

# Кодируем категориальные признаки с помощью CatBoostEncoder
encoder = CatBoostEncoder(cols=['location', 'addrss_type', 'prvs_npf', 'brth_plc', 'okato'])
df_encoded = encoder.fit_transform(df[['location', 'addrss_type', 'prvs_npf', 'brth_plc', 'okato']], df[target])  # Кодируем только категориальные переменные

# Объединяем закодированные данные с бинарными и числовыми переменными
final_columns = binary_columns + additional_columns + ['accnt_bgn_year']
df_final = pd.concat([df_encoded, df[final_columns]], axis=1)

# Убедитесь, что целевая переменная всё ещё присутствует
if target in df.columns:
    df_final[target] = df[target]

df_final = df_final.apply(pd.to_numeric, errors='coerce').fillna(0)

# Проверяем, что все значения числовые, и заменяем любые NaN на 0
df_final = df_final.apply(pd.to_numeric, errors='coerce').fillna(0)
df_final.to_csv(FP3, encoding='utf-8', index=False)


