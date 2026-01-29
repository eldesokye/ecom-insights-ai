// AI-Powered Dynamic Bundle Generation Engine
class BundleEngine {
    constructor(productManager, actionTracker) {
        this.productManager = productManager;
        this.actionTracker = actionTracker;
        this.bundles = [];
        this.bundleIdCounter = 1;
    }

    // Main method to generate personalized bundles
    generatePersonalizedBundles(currentCart = []) {
        const userActions = this.actionTracker.actions;
        const bundles = [];

        // Strategy 1: Frequently Viewed Together
        const viewedBundle = this.createFrequentlyViewedBundle(userActions);
        if (viewedBundle) bundles.push(viewedBundle);

        // Strategy 2: Category-Based Complementary Products
        const categoryBundle = this.createCategoryBundle(userActions);
        if (categoryBundle) bundles.push(categoryBundle);

        // Strategy 3: Cart Completion Bundle
        if (currentCart.length > 0) {
            const cartBundle = this.createCartCompletionBundle(currentCart);
            if (cartBundle) bundles.push(cartBundle);
        }

        // Strategy 4: Search Intent Bundle
        const searchBundle = this.createSearchIntentBundle(userActions);
        if (searchBundle) bundles.push(searchBundle);

        // Strategy 5: Smart Home Ecosystem Bundle
        const ecosystemBundle = this.createEcosystemBundle(userActions);
        if (ecosystemBundle) bundles.push(ecosystemBundle);

        this.bundles = bundles;
        return bundles;
    }

    // Strategy 1: Products frequently viewed together
    createFrequentlyViewedBundle(actions) {
        const viewedProducts = actions
            .filter(a => a.type === 'product_view')
            .map(a => a.data.productId);

        if (viewedProducts.length < 2) return null;

        // Get most recent unique views
        const uniqueViews = [...new Set(viewedProducts)].slice(-4);
        const products = uniqueViews
            .map(id => this.productManager.getProductById(id))
            .filter(p => p);

        if (products.length < 2) return null;

        return this.createBundle(
            'Frequently Viewed Together',
            products,
            'Based on your browsing history',
            0.15, // 15% discount
            '🔥'
        );
    }

    // Strategy 2: Category-based complementary products
    createCategoryBundle(actions) {
        const viewedProducts = actions
            .filter(a => a.type === 'product_view')
            .map(a => a.data.productId);

        if (viewedProducts.length === 0) return null;

        // Find most viewed category
        const categories = {};
        viewedProducts.forEach(id => {
            const product = this.productManager.getProductById(id);
            if (product) {
                categories[product.category] = (categories[product.category] || 0) + 1;
            }
        });

        const topCategory = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])[0];

        if (!topCategory) return null;

        const categoryProducts = this.productManager
            .getProductsByCategory(topCategory[0])
            .slice(0, 3);

        if (categoryProducts.length < 2) return null;

        return this.createBundle(
            `${topCategory[0]} Essentials`,
            categoryProducts,
            `Complete your ${topCategory[0].toLowerCase()} collection`,
            0.12,
            '⭐'
        );
    }

    // Strategy 3: Complete your cart bundle
    createCartCompletionBundle(cartItems) {
        if (cartItems.length === 0) return null;

        const cartProductIds = cartItems.map(item => item.id);
        const complementaryProducts = [];

        // Find products that complement cart items
        cartItems.forEach(item => {
            const related = this.productManager.getRelatedProducts(item.id, 2);
            related.forEach(p => {
                if (!cartProductIds.includes(p.id) &&
                    !complementaryProducts.find(cp => cp.id === p.id)) {
                    complementaryProducts.push(p);
                }
            });
        });

        if (complementaryProducts.length === 0) return null;

        const bundleProducts = complementaryProducts.slice(0, 3);

        return this.createBundle(
            'Complete Your Order',
            bundleProducts,
            'Customers who bought these also added',
            0.10,
            '🎁'
        );
    }

    // Strategy 4: Search intent-based bundle
    createSearchIntentBundle(actions) {
        const searches = actions
            .filter(a => a.type === 'search')
            .map(a => a.data.query);

        if (searches.length === 0) return null;

        const lastSearch = searches[searches.length - 1];
        const searchResults = this.productManager.searchProducts(lastSearch);

        if (searchResults.length < 2) return null;

        return this.createBundle(
            'Based on Your Search',
            searchResults.slice(0, 3),
            `Perfect matches for "${lastSearch}"`,
            0.08,
            '🔍'
        );
    }

    // Strategy 5: Ecosystem bundle (smart home, fitness set, etc.)
    createEcosystemBundle(actions) {
        const viewedProducts = actions
            .filter(a => a.type === 'product_view')
            .map(a => {
                const product = this.productManager.getProductById(a.data.productId);
                return product;
            })
            .filter(p => p);

        // Check for smart home interest
        const smartHomeProducts = viewedProducts.filter(p =>
            p.tags.includes('smart-home') || p.tags.includes('iot')
        );

        if (smartHomeProducts.length > 0) {
            const allSmartHome = this.productManager.products
                .filter(p => p.tags.includes('smart-home') || p.tags.includes('iot'))
                .slice(0, 3);

            if (allSmartHome.length >= 2) {
                return this.createBundle(
                    'Smart Home Starter Kit',
                    allSmartHome,
                    'Build your connected home',
                    0.20,
                    '🏠'
                );
            }
        }

        // Check for fitness interest
        const fitnessProducts = viewedProducts.filter(p =>
            p.category === 'Fitness'
        );

        if (fitnessProducts.length > 0) {
            const allFitness = this.productManager.products
                .filter(p => p.category === 'Fitness')
                .slice(0, 3);

            if (allFitness.length >= 2) {
                return this.createBundle(
                    'Fitness Starter Pack',
                    allFitness,
                    'Everything you need to start your fitness journey',
                    0.18,
                    '💪'
                );
            }
        }

        return null;
    }

    // Helper method to create bundle object
    createBundle(name, products, description, discountRate, icon = '📦') {
        const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
        const discountAmount = totalPrice * discountRate;
        const finalPrice = totalPrice - discountAmount;

        return {
            id: `bundle_${this.bundleIdCounter++}`,
            name,
            description,
            icon,
            products,
            originalPrice: totalPrice,
            discountRate: discountRate * 100, // Convert to percentage
            discountAmount,
            finalPrice,
            savings: discountAmount
        };
    }

    // Calculate bundle score based on user behavior
    calculateBundleScore(bundle, userActions) {
        let score = 0;

        // Higher score for products user has viewed
        const viewedProductIds = userActions
            .filter(a => a.type === 'product_view')
            .map(a => a.data.productId);

        bundle.products.forEach(product => {
            if (viewedProductIds.includes(product.id)) {
                score += 10;
            }
        });

        // Higher score for larger discounts
        score += bundle.discountRate;

        // Higher score for more products
        score += bundle.products.length * 2;

        return score;
    }

    // Get top bundles sorted by relevance
    getTopBundles(limit = 3) {
        const userActions = this.actionTracker.actions;

        return this.bundles
            .map(bundle => ({
                ...bundle,
                score: this.calculateBundleScore(bundle, userActions)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Track bundle performance
    getBundleAnalytics() {
        const bundleViews = this.actionTracker.getActionsByType('bundle_view');
        const bundleAccepts = this.actionTracker.getActionsByType('bundle_accept');
        const bundleRejects = this.actionTracker.getActionsByType('bundle_reject');

        return {
            totalBundlesShown: this.bundles.length,
            bundleViews: bundleViews.length,
            bundleAccepts: bundleAccepts.length,
            bundleRejects: bundleRejects.length,
            conversionRate: bundleViews.length > 0
                ? (bundleAccepts.length / bundleViews.length * 100).toFixed(2) + '%'
                : '0%'
        };
    }
}

// Export for use in other modules
window.BundleEngine = BundleEngine;
