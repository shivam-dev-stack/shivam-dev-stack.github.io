---
title: Exploratory Data Analysis With Pandas & Plotly
date: 2025-02-18
tags: python, eda
---

Before any model, there's data. And before any data pipeline, there's EDA. Here's the workflow I use every time I touch a new dataset.

## 1. Load and Inspect

```python
import pandas as pd
import plotly.express as px

df = pd.read_csv('data.csv')

print(df.shape)         # rows, columns
print(df.dtypes)        # data types
print(df.head())        # first look
print(df.describe())    # summary statistics
```

`describe()` is underrated. Always check:
- Are min/max values plausible?
- Is the mean far from the median? (Skew)
- What's the standard deviation relative to the mean?

## 2. Handle Missing Values

```python
# Overview of nulls
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(2)
pd.DataFrame({'count': missing, 'pct': missing_pct}).sort_values('pct', ascending=False)
```

**Decisions to make for each null column:**
- Drop the column (>50% missing, often)
- Impute with median/mode (numeric/categorical)
- Flag missingness as its own feature (sometimes the fact it's missing *is* signal)

## 3. Visualize Distributions

```python
# Histograms for numeric columns
for col in df.select_dtypes('number').columns:
    fig = px.histogram(df, x=col, nbins=50, title=f'Distribution of {col}')
    fig.show()

# Bar charts for categoricals
for col in df.select_dtypes('object').columns:
    vc = df[col].value_counts().head(20)
    fig = px.bar(x=vc.index, y=vc.values, title=f'Top values: {col}')
    fig.show()
```

## 4. Correlation Analysis

```python
import plotly.graph_objects as go

corr = df.select_dtypes('number').corr()

fig = go.Figure(data=go.Heatmap(
    z=corr.values,
    x=corr.columns,
    y=corr.columns,
    colorscale='RdBu',
    zmid=0
))
fig.update_layout(title='Correlation Matrix')
fig.show()
```

Watch for:
- Features highly correlated with the target (good signal)
- Features highly correlated with each other (multicollinearity — may want to drop one)

## 5. Relationships With the Target

```python
target = 'price'

# Numeric features vs target
for col in df.select_dtypes('number').columns:
    if col != target:
        fig = px.scatter(df, x=col, y=target, trendline='ols',
                         title=f'{col} vs {target}')
        fig.show()

# Categorical features vs target
for col in df.select_dtypes('object').columns:
    fig = px.box(df, x=col, y=target, title=f'{target} by {col}')
    fig.show()
```

## EDA Checklist

- [ ] Check shape, dtypes, head, describe
- [ ] Quantify missing values per column
- [ ] Plot distributions for all numeric/categorical columns
- [ ] Build a correlation matrix
- [ ] Visualize relationships between features and target
- [ ] Document your observations before modeling

---

Good EDA doesn't just catch bugs — it reveals the story your data is trying to tell. The best feature engineering ideas almost always come from time spent *looking* before coding.
