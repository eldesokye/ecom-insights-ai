// Python Backend API Bridge
// Simplified JavaScript connector for frontend to call Python backend

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

class PythonBackendAPI {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // ============================================
    // CHATBOT API
    // ============================================

    async sendChatMessage(message, userContext) {
        /**
         * Send message to Python chatbot
         * 
         * @param {string} message - User's message
         * @param {Object} userContext - User behavior context
         * @returns {Promise<Object>} AI response with text and products
         */
        try {
            const response = await fetch(`${this.baseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_context: userContext
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Chat API error:', error);
            throw error;
        }
    }

    // ============================================
    // BUNDLE API
    // ============================================

    async generateBundles(userActions, cartItems) {
        /**
         * Generate personalized bundles
         * 
         * @param {Array} userActions - List of user action objects
         * @param {Array} cartItems - List of product IDs in cart
         * @returns {Promise<Object>} Bundles array
         */
        try {
            const response = await fetch(`${this.baseUrl}/bundles/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_actions: userActions,
                    cart_items: cartItems
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Bundle API error:', error);
            throw error;
        }
    }

    async getTopBundles(userActions, limit = 3) {
        /**
         * Get top-ranked bundles
         */
        try {
            const response = await fetch(`${this.baseUrl}/bundles/top`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_actions: userActions,
                    limit: limit
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Top bundles API error:', error);
            throw error;
        }
    }

    // ============================================
    // PRODUCT API
    // ============================================

    async getAllProducts() {
        /**
         * Get all products from Python backend
         */
        try {
            const response = await fetch(`${this.baseUrl}/products`);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Products API error:', error);
            throw error;
        }
    }

    async searchProducts(query) {
        /**
         * Search products
         */
        try {
            const response = await fetch(`${this.baseUrl}/products/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Search API error:', error);
            throw error;
        }
    }

    // ============================================
    // HEALTH CHECK
    // ============================================

    async checkHealth() {
        /**
         * Check if Python backend is running
         */
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.ok;
        } catch (error) {
            console.error('Backend not available:', error);
            return false;
        }
    }
}

// Export for use in other modules
window.PythonBackendAPI = PythonBackendAPI;
