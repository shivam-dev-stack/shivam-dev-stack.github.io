---
title: Why Your Model Looks Great But Fails in Production
date: 2025-02-03
tags: mlops, debugging
---

You hit 94% accuracy on your test set. You celebrate. You deploy. And then — nothing works.

This is one of the most demoralizing experiences in applied ML. Here are the most common culprits, and how to catch them before they catch you.

## 1. Data Leakage

Leakage happens when information from the future (or from the target itself) sneaks into your training features. Your model learns a shortcut that doesn't exist in production.

**Classic examples:**

- Scaling or normalizing *before* train/test split (mean computed on test data infects training)
- Using a feature that's only known *after* the event you're predicting
- Target encoding without proper cross-validation folds

**Fix:** Build a clean pipeline. Fit all preprocessing on training data *only*. Use `sklearn.pipeline.Pipeline` — it enforces this correctly.

## 2. Distribution Shift

Your training data reflects the world at one point in time. The world changes.

> A fraud detection model trained on 2022 data will be blind to new attack patterns that emerged in 2023.

**Types of shift:**

- **Covariate shift**: Input distribution P(X) changes, but P(Y|X) stays the same
- **Label shift**: The class balance changes over time
- **Concept drift**: The relationship P(Y|X) itself changes

**What to do:** Monitor input feature distributions in production. Set up alerts when feature statistics drift beyond a threshold. Retrain on a rolling window of recent data.

## 3. Train-Serve Skew

Your training code and your serving code compute features differently. This is embarrassingly common.

```python
# Training time
df['tenure_days'] = (df['reference_date'] - df['signup_date']).dt.days

# Production time (bug!)
user['tenure_days'] = (datetime.now() - user['signup_date']).days
# ↑ Different reference point → different values → garbage predictions
```

**Fix:** Use a shared feature computation library for both training and serving. Feature stores (Feast, Tecton, Hopsworks) exist specifically to solve this.

## 4. Metric-Reality Mismatch

You optimized for accuracy. But accuracy on an imbalanced dataset is meaningless. Or you used AUC, but your business only acts on the top 1% of predictions.

Ask: **"What decision does this model enable, and what does a mistake cost?"** Then pick a metric that reflects that.

## Practical Checklist

- [ ] No preprocessing fit on test data
- [ ] Feature computation is identical at train and serve time
- [ ] Evaluation metric matches the real-world objective
- [ ] Monitor feature distributions post-deployment
- [ ] Have a retraining cadence

---

Debugging production ML failures is part detective work, part discipline. Most of it comes down to being ruthlessly careful about *where information flows* in your pipeline.
