// User Action Tracking System
class ActionTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.actions = this.loadActions();
        this.currentProduct = null;
        this.viewStartTime = null;
        this.initializeTracking();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    loadActions() {
        const stored = localStorage.getItem('userActions');
        return stored ? JSON.parse(stored) : [];
    }

    saveActions() {
        localStorage.setItem('userActions', JSON.stringify(this.actions));
    }

    trackAction(actionType, data = {}) {
        const action = {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            type: actionType,
            data: data
        };

        this.actions.push(action);
        this.saveActions();

        // Emit custom event for other components to react
        window.dispatchEvent(new CustomEvent('actionTracked', {
            detail: action
        }));

        console.log('📊 Action Tracked:', actionType, data);
    }

    // Product View Tracking
    trackProductView(productId, productName) {
        this.currentProduct = productId;
        this.viewStartTime = Date.now();

        this.trackAction('product_view', {
            productId,
            productName
        });
    }

    trackProductViewEnd(productId) {
        if (this.currentProduct === productId && this.viewStartTime) {
            const duration = Date.now() - this.viewStartTime;
            this.trackAction('product_view_duration', {
                productId,
                durationMs: duration,
                durationSeconds: Math.round(duration / 1000)
            });
            this.viewStartTime = null;
        }
    }

    // Search Tracking
    trackSearch(query, resultsCount) {
        this.trackAction('search', {
            query,
            resultsCount
        });
    }

    // Cart Actions
    trackAddToCart(productId, productName, price) {
        this.trackAction('add_to_cart', {
            productId,
            productName,
            price
        });
    }

    trackRemoveFromCart(productId, productName) {
        this.trackAction('remove_from_cart', {
            productId,
            productName
        });
    }

    trackCartView() {
        this.trackAction('cart_view', {});
    }

    // Bundle Interactions
    trackBundleView(bundleId, products) {
        this.trackAction('bundle_view', {
            bundleId,
            productIds: products.map(p => p.id),
            productCount: products.length
        });
    }

    trackBundleAccept(bundleId, products, totalPrice) {
        this.trackAction('bundle_accept', {
            bundleId,
            productIds: products.map(p => p.id),
            totalPrice
        });
    }

    trackBundleReject(bundleId) {
        this.trackAction('bundle_reject', {
            bundleId
        });
    }

    // Chatbot Interactions
    trackChatbotOpen() {
        this.trackAction('chatbot_open', {});
    }

    trackChatbotClose() {
        this.trackAction('chatbot_close', {});
    }

    trackChatbotMessage(message, isUser) {
        this.trackAction('chatbot_message', {
            message,
            isUser,
            messageLength: message.length
        });
    }

    // Category Browsing
    trackCategoryView(category) {
        this.trackAction('category_view', {
            category
        });
    }

    // Click Tracking
    trackClick(elementType, elementId, elementText) {
        this.trackAction('click', {
            elementType,
            elementId,
            elementText
        });
    }

    // Analytics Methods
    getActionsByType(type) {
        return this.actions.filter(a => a.type === type);
    }

    getRecentActions(limit = 10) {
        return this.actions.slice(-limit);
    }

    getMostViewedProducts() {
        const views = this.getActionsByType('product_view');
        const productCounts = {};

        views.forEach(view => {
            const id = view.data.productId;
            productCounts[id] = (productCounts[id] || 0) + 1;
        });

        return Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([id, count]) => ({ productId: parseInt(id), viewCount: count }));
    }

    getSearchHistory() {
        return this.getActionsByType('search')
            .map(a => a.data.query)
            .filter((v, i, a) => a.indexOf(v) === i); // unique
    }

    getCartAdditions() {
        return this.getActionsByType('add_to_cart');
    }

    getUserInterests() {
        // Analyze actions to determine user interests
        const interests = {
            categories: {},
            priceRange: { min: Infinity, max: 0 },
            searchTerms: []
        };

        this.actions.forEach(action => {
            if (action.type === 'search') {
                interests.searchTerms.push(action.data.query);
            }
            if (action.type === 'add_to_cart' || action.type === 'product_view') {
                const price = action.data.price;
                if (price) {
                    interests.priceRange.min = Math.min(interests.priceRange.min, price);
                    interests.priceRange.max = Math.max(interests.priceRange.max, price);
                }
            }
        });

        return interests;
    }

    // Initialize automatic tracking
    initializeTracking() {
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.currentProduct) {
                this.trackProductViewEnd(this.currentProduct);
            }
        });

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent > 25 && scrollPercent < 30) {
                    this.trackAction('scroll_depth', { depth: 25 });
                } else if (scrollPercent > 50 && scrollPercent < 55) {
                    this.trackAction('scroll_depth', { depth: 50 });
                } else if (scrollPercent > 75 && scrollPercent < 80) {
                    this.trackAction('scroll_depth', { depth: 75 });
                }
            }
        });

        console.log('✅ Action Tracker Initialized - Session:', this.sessionId);
    }

    // Clear all tracking data (for testing/privacy)
    clearAllData() {
        this.actions = [];
        localStorage.removeItem('userActions');
        console.log('🗑️ All tracking data cleared');
    }

    // Get summary statistics
    getSummary() {
        return {
            totalActions: this.actions.length,
            sessionId: this.sessionId,
            productViews: this.getActionsByType('product_view').length,
            searches: this.getActionsByType('search').length,
            cartAdditions: this.getActionsByType('add_to_cart').length,
            chatbotInteractions: this.getActionsByType('chatbot_message').length,
            mostViewedProducts: this.getMostViewedProducts().slice(0, 5)
        };
    }
}

// Export for use in other modules
window.ActionTracker = ActionTracker;
