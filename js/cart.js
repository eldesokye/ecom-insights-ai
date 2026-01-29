// Shopping Cart Management
class ShoppingCart {
    constructor(actionTracker) {
        this.actionTracker = actionTracker;
        this.items = this.loadCart();
        this.listeners = [];
    }

    loadCart() {
        const stored = localStorage.getItem('shoppingCart');
        return stored ? JSON.parse(stored) : [];
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        this.notifyListeners();
    }

    // Add listener for cart updates
    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.items));
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.actionTracker.trackAddToCart(product.id, product.name, product.price);

        return true;
    }

    // Add multiple items (for bundles)
    addBundle(products) {
        products.forEach(product => {
            this.addItem(product, 1);
        });
    }

    // Remove item from cart
    removeItem(productId) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            this.actionTracker.trackRemoveFromCart(item.id, item.name);
        }

        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get cart items
    getItems() {
        return this.items;
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate total price
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Get subtotal (before tax/shipping)
    getSubtotal() {
        return this.getTotal();
    }

    // Calculate tax (example: 10%)
    getTax() {
        return this.getSubtotal() * 0.10;
    }

    // Calculate shipping (free over $100)
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 100 ? 0 : 9.99;
    }

    // Get grand total
    getGrandTotal() {
        return this.getSubtotal() + this.getTax() + this.getShipping();
    }

    // Clear cart
    clear() {
        this.items = [];
        this.saveCart();
    }

    // Check if product is in cart
    hasProduct(productId) {
        return this.items.some(item => item.id === productId);
    }

    // Get cart summary
    getSummary() {
        return {
            itemCount: this.getItemCount(),
            subtotal: this.getSubtotal(),
            tax: this.getTax(),
            shipping: this.getShipping(),
            total: this.getGrandTotal(),
            items: this.items
        };
    }
}

// Export for use in other modules
window.ShoppingCart = ShoppingCart;
