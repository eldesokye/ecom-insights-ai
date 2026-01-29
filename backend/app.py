"""
SmartShop AI - Python Backend
Flask API for AI Chatbot and Dynamic Bundle Recommendations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json

# Import our modules
from chatbot import AIChatbot
from bundle_engine import BundleEngine
from products import ProductManager

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize components
product_manager = ProductManager()
bundle_engine = BundleEngine(product_manager)
chatbot = AIChatbot(product_manager, bundle_engine)

# ============================================
# CHATBOT ENDPOINTS
# ============================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Process chatbot messages with Groq AI
    
    Request JSON:
    {
        "message": "user message",
        "user_context": {
            "viewed_products": [1, 2, 3],
            "searches": ["wireless"],
            "cart_items": [{"id": 1, "name": "Product"}]
        }
    }
    
    Response JSON:
    {
        "text": "AI response",
        "products": [...],  # Optional product recommendations
        "timestamp": "ISO timestamp"
    }
    """
    try:
        data = request.json
        message = data.get('message', '')
        user_context = data.get('user_context', {})
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Process message with AI
        response = chatbot.process_message(message, user_context)
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat/history', methods=['POST'])
def get_chat_history():
    """Get conversation history"""
    try:
        session_id = request.json.get('session_id')
        history = chatbot.get_conversation_history(session_id)
        return jsonify({'history': history}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# BUNDLE RECOMMENDATION ENDPOINTS
# ============================================

@app.route('/api/bundles/generate', methods=['POST'])
def generate_bundles():
    """
    Generate personalized product bundles
    
    Request JSON:
    {
        "user_actions": [
            {"type": "product_view", "product_id": 1},
            {"type": "search", "query": "wireless"},
            {"type": "add_to_cart", "product_id": 2}
        ],
        "cart_items": [1, 2, 3]
    }
    
    Response JSON:
    {
        "bundles": [
            {
                "id": "bundle_1",
                "name": "Electronics Essentials",
                "description": "...",
                "products": [...],
                "original_price": 500.00,
                "discount_rate": 15,
                "final_price": 425.00,
                "savings": 75.00
            }
        ]
    }
    """
    try:
        data = request.json
        user_actions = data.get('user_actions', [])
        cart_items = data.get('cart_items', [])
        
        # Generate bundles based on user behavior
        bundles = bundle_engine.generate_personalized_bundles(
            user_actions=user_actions,
            cart_items=cart_items
        )
        
        return jsonify({'bundles': bundles}), 200
        
    except Exception as e:
        print(f"Bundle generation error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/bundles/top', methods=['POST'])
def get_top_bundles():
    """Get top-ranked bundles"""
    try:
        data = request.json
        user_actions = data.get('user_actions', [])
        limit = data.get('limit', 3)
        
        bundles = bundle_engine.get_top_bundles(user_actions, limit)
        
        return jsonify({'bundles': bundles}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# PRODUCT ENDPOINTS
# ============================================

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products"""
    try:
        products = product_manager.get_all_products()
        return jsonify({'products': products}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = product_manager.get_product_by_id(product_id)
        if product:
            return jsonify(product), 200
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/search', methods=['POST'])
def search_products():
    """Search products"""
    try:
        query = request.json.get('query', '')
        results = product_manager.search_products(query)
        return jsonify({'products': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/products/category/<category>', methods=['GET'])
def get_products_by_category(category):
    """Get products by category"""
    try:
        products = product_manager.get_products_by_category(category)
        return jsonify({'products': products}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# ANALYTICS ENDPOINTS
# ============================================

@app.route('/api/analytics/bundle-performance', methods=['POST'])
def get_bundle_analytics():
    """Get bundle performance analytics"""
    try:
        data = request.json
        user_actions = data.get('user_actions', [])
        
        analytics = bundle_engine.get_bundle_analytics(user_actions)
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'SmartShop AI Backend',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    print("🚀 Starting SmartShop AI Backend...")
    print("📍 Server running on http://localhost:5000")
    print("📚 API Documentation:")
    print("   - POST /api/chat - Chatbot messages")
    print("   - POST /api/bundles/generate - Generate bundles")
    print("   - GET  /api/products - Get all products")
    print("   - GET  /api/health - Health check")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
