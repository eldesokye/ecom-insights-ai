// Main Application Controller
class App {
    constructor() {
        this.productManager = new ProductManager();
        this.actionTracker = new ActionTracker();
        this.cart = new ShoppingCart(this.actionTracker);
        this.bundleEngine = new BundleEngine(this.productManager, this.actionTracker);
        this.chatbot = new AIChatbot(this.productManager, this.actionTracker, this.bundleEngine);

        this.currentFilter = 'all';
        this.searchQuery = '';
        this.chatbotOpen = false;

        this.init();
    }

    init() {
        console.log('🚀 E-Commerce AI System Initialized');

        // Render initial UI
        this.renderProducts();
        this.renderCart();
        this.updateBundles();
        this.setupEventListeners();
        this.setupChatbot();

        // Listen for cart updates
        this.cart.addListener(() => {
            this.renderCart();
            this.updateBundles();
        });

        // Listen for action tracking events
        window.addEventListener('actionTracked', (e) => {
            // Update bundles when significant actions occur
            if (['product_view', 'search', 'add_to_cart'].includes(e.detail.type)) {
                this.updateBundles();
            }
        });

        // Show welcome message
        this.showNotification('Welcome! 🎉 Browse products and get personalized bundle recommendations!', 'info');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        // Category filter
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                this.actionTracker.trackCartView();
                document.getElementById('cartSidebar').classList.toggle('open');
            });
        }

        // Close cart
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                document.getElementById('cartSidebar').classList.remove('open');
            });
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();

        if (query) {
            this.searchQuery = query;
            const results = this.productManager.searchProducts(query);
            this.actionTracker.trackSearch(query, results.length);
            this.renderProducts(results);
            this.showNotification(`Found ${results.length} products for "${query}"`, 'success');
        }
    }

    filterByCategory(category) {
        this.currentFilter = category;

        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });

        if (category === 'all') {
            this.renderProducts();
        } else {
            this.actionTracker.trackCategoryView(category);
            const products = this.productManager.getProductsByCategory(category);
            this.renderProducts(products);
        }
    }

    renderProducts(products = null) {
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;

        const productsToShow = products || this.productManager.getAllProducts();

        productGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn-add-cart" data-product-id="${product.id}">
                            ${this.cart.hasProduct(product.id) ? '✓ In Cart' : '+ Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to product cards
        productGrid.querySelectorAll('.product-card').forEach(card => {
            const productId = parseInt(card.dataset.productId);
            const product = this.productManager.getProductById(productId);

            // Track product view on hover
            card.addEventListener('mouseenter', () => {
                this.actionTracker.trackProductView(productId, product.name);
            });

            // Add to cart button
            const addBtn = card.querySelector('.btn-add-cart');
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.productManager.getProductById(productId);
        if (product) {
            this.cart.addItem(product);
            this.showNotification(`${product.name} added to cart! 🛒`, 'success');
            this.renderProducts(); // Re-render to update button states
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTax = document.getElementById('cartTax');
        const cartShipping = document.getElementById('cartShipping');

        const items = this.cart.getItems();
        const summary = this.cart.getSummary();

        // Update cart count badge
        if (cartCount) {
            cartCount.textContent = summary.itemCount;
            cartCount.style.display = summary.itemCount > 0 ? 'flex' : 'none';
        }

        // Render cart items
        if (cartItems) {
            if (items.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty 🛒</div>';
            } else {
                cartItems.innerHTML = items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.image}</div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                `).join('');

                // Add event listeners for quantity buttons
                cartItems.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = parseInt(btn.dataset.id);
                        const action = btn.dataset.action;
                        const item = items.find(i => i.id === id);

                        if (action === 'increase') {
                            this.cart.updateQuantity(id, item.quantity + 1);
                        } else {
                            this.cart.updateQuantity(id, item.quantity - 1);
                        }
                    });
                });

                // Add event listeners for remove buttons
                cartItems.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = parseInt(btn.dataset.id);
                        this.cart.removeItem(id);
                    });
                });
            }
        }

        // Update totals
        if (cartSubtotal) cartSubtotal.textContent = `$${summary.subtotal.toFixed(2)}`;
        if (cartTax) cartTax.textContent = `$${summary.tax.toFixed(2)}`;
        if (cartShipping) cartShipping.textContent = summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${summary.total.toFixed(2)}`;
    }

    updateBundles() {
        const bundlesContainer = document.getElementById('bundlesContainer');
        if (!bundlesContainer) return;

        const bundles = this.bundleEngine.generatePersonalizedBundles(this.cart.getItems());
        const topBundles = this.bundleEngine.getTopBundles(3);

        if (topBundles.length === 0) {
            bundlesContainer.innerHTML = '<div class="no-bundles">Browse products to see personalized bundle recommendations! 🎁</div>';
            return;
        }

        bundlesContainer.innerHTML = topBundles.map(bundle => `
            <div class="bundle-card" data-bundle-id="${bundle.id}">
                <div class="bundle-header">
                    <span class="bundle-icon">${bundle.icon}</span>
                    <h3 class="bundle-name">${bundle.name}</h3>
                </div>
                <p class="bundle-description">${bundle.description}</p>
                <div class="bundle-products">
                    ${bundle.products.map(p => `
                        <div class="bundle-product-item">
                            <span class="bundle-product-icon">${p.image}</span>
                            <span class="bundle-product-name">${p.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="bundle-pricing">
                    <div class="bundle-original-price">$${bundle.originalPrice.toFixed(2)}</div>
                    <div class="bundle-discount">${bundle.discountRate.toFixed(0)}% OFF</div>
                    <div class="bundle-final-price">$${bundle.finalPrice.toFixed(2)}</div>
                </div>
                <div class="bundle-savings">Save $${bundle.savings.toFixed(2)}!</div>
                <button class="btn-add-bundle" data-bundle-id="${bundle.id}">Add Bundle to Cart</button>
            </div>
        `).join('');

        // Add event listeners to bundle cards
        bundlesContainer.querySelectorAll('.bundle-card').forEach(card => {
            const bundleId = card.dataset.bundleId;
            const bundle = topBundles.find(b => b.id === bundleId);

            // Track bundle view
            card.addEventListener('mouseenter', () => {
                this.actionTracker.trackBundleView(bundleId, bundle.products);
            });

            // Add bundle to cart
            const addBtn = card.querySelector('.btn-add-bundle');
            addBtn.addEventListener('click', () => {
                this.cart.addBundle(bundle.products);
                this.actionTracker.trackBundleAccept(bundleId, bundle.products, bundle.finalPrice);
                this.showNotification(`Bundle "${bundle.name}" added to cart! 🎉`, 'success');
            });
        });
    }

    setupChatbot() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotClose = document.getElementById('chatbotClose');
        const chatbotSend = document.getElementById('chatbotSend');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotWidget = document.getElementById('chatbotWidget');

        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', () => {
                this.toggleChatbot();
            });
        }

        if (chatbotClose) {
            chatbotClose.addEventListener('click', () => {
                this.toggleChatbot();
            });
        }

        if (chatbotSend && chatbotInput) {
            chatbotSend.addEventListener('click', () => this.sendChatMessage());
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }
    }

    toggleChatbot() {
        this.chatbotOpen = !this.chatbotOpen;
        const widget = document.getElementById('chatbotWidget');

        if (this.chatbotOpen) {
            widget.classList.add('open');
            this.actionTracker.trackChatbotOpen();

            // Send welcome message if first time
            if (this.chatbot.conversationHistory.length === 0) {
                this.addChatMessage('assistant', 'Hello! 👋 I\'m your AI shopping assistant. How can I help you today?');
            }
        } else {
            widget.classList.remove('open');
            this.actionTracker.trackChatbotClose();
        }
    }

    async sendChatMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addChatMessage('user', message);
        input.value = '';

        // Get bot response
        const response = await this.chatbot.processMessage(message);

        // Add bot response
        this.addChatMessage('assistant', response.text, response.data);
    }

    addChatMessage(role, text, data = null) {
        const chatMessages = document.getElementById('chatMessages');

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        let content = `<div class="message-text">${text}</div>`;

        // Add product recommendations if present
        if (data && data.type === 'product_list') {
            content += '<div class="chat-products">';
            data.products.forEach(product => {
                content += `
                    <div class="chat-product" data-product-id="${product.id}">
                        <span class="chat-product-icon">${product.image}</span>
                        <div class="chat-product-info">
                            <div class="chat-product-name">${product.name}</div>
                            <div class="chat-product-price">$${product.price.toFixed(2)}</div>
                        </div>
                        <button class="btn-chat-add" data-product-id="${product.id}">+</button>
                    </div>
                `;
            });
            content += '</div>';
        }

        messageDiv.innerHTML = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add event listeners to product buttons in chat
        messageDiv.querySelectorAll('.btn-chat-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.dataset.productId);
                this.addToCart(productId);
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
