# 🐍 Python Backend - Quick Start

## Setup (3 Steps)

### 1. Install Dependencies
```bash
cd "d:\deciosn ai system\backend"
pip install -r requirements.txt
```

### 2. Run Python Server
```bash
python app.py
```

You should see:
```
🚀 Starting SmartShop AI Backend...
📍 Server running on http://localhost:5000
```

### 3. Open Frontend
Double-click: `d:\deciosn ai system\index.html`

---

## ✅ Files Restored

- ✅ `js/pythonAPI.js` - API bridge
- ✅ `backend/requirements.txt` - Dependencies
- ✅ `backend/app.py` - Flask server
- ✅ `backend/chatbot.py` - AI chatbot
- ✅ `backend/bundle_engine.py` - Bundle generator
- ✅ `backend/products.py` - Product catalog

---

## 🧪 Test It Works

1. **Start backend:** `python backend/app.py`
2. **Open browser:** Visit `http://localhost:5000/api/health`
3. **Should see:** `{"status": "healthy"}`
4. **Open frontend:** `index.html`
5. **Chat with AI:** Click "Chat with AI" button

---

## 📝 Python Files You Can Edit

### `backend/chatbot.py`
```python
# Modify AI responses
# Change Groq model
# Adjust temperature/tokens
```

### `backend/bundle_engine.py`
```python
# Change discount rates
# Add new bundling strategies
# Modify scoring algorithm
```

### `backend/products.py`
```python
# Add new products
# Change categories
# Modify search logic
```

---

## 🐛 Troubleshooting

**"Module not found"**
```bash
pip install flask flask-cors groq python-dotenv
```

**"Port 5000 in use"**
- Change port in `app.py`: `app.run(port=5001)`
- Update `js/pythonAPI.js`: `const API_BASE_URL = 'http://localhost:5001/api';`

**"Backend not connecting"**
- Make sure `python app.py` is running
- Check console (F12) for errors
- Visit `http://localhost:5000/api/health`

---

## 🎯 What Each File Does

| File | Purpose |
|------|---------|
| `app.py` | Flask server with API endpoints |
| `chatbot.py` | Groq AI integration for chat |
| `bundle_engine.py` | 5 strategies for bundles |
| `products.py` | Product catalog (18 items) |
| `pythonAPI.js` | Frontend ↔ Backend bridge |

---

**Ready to code in Python! 🐍**
