# 🧠 E-commerce Decision Intelligence System
## Developer Build Guide (MVP)

This document is a **technical roadmap** to build the MVP step by step.
No marketing. No theory. Just execution.

---

## 0️⃣ Tech Stack (MVP)

- Language: Python 3.10+
- Backend: FastAPI
- Data Processing: Pandas, NumPy
- ML: Scikit-learn, XGBoost
- DB: PostgreSQL (later) / CSV & Parquet (MVP)
- Storage: Local FS (simulate S3)
- Dashboard: Streamlit
- Deployment (later): Docker

---

## 1️⃣ Data Layer (Week 1)

### Goal
Collect **event-level e-commerce data**.

### Events Schema
Each event must contain:

```json
{
  "event_type": "product_view",
  "user_id": "u123",
  "session_id": "s456",
  "product_id": "p789",
  "timestamp": "2025-01-01T12:00:00",
  "price": 1200,
  "category": "mens_jackets"
}
