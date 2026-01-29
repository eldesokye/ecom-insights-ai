// AI-Powered Chatbot for E-Commerce with Groq Integration
class AIChatbot {
    constructor(productManager, actionTracker, bundleEngine) {
        this.productManager = productManager;
        this.actionTracker = actionTracker;
        this.bundleEngine = bundleEngine;
        this.conversationHistory = [];
        this.context = {
            lastRecommendedProducts: [],
            userIntent: null,
            currentTopic: null
        };

        // Groq API Configuration
        this.groqApiKey = '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';
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama-3.3-70b-versatile'; // Fast and intelligent model
    }

    // Main method to process user messages with Groq AI
    async processMessage(userMessage) {
        this.conversationHistory.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        });

        // Track the interaction
        this.actionTracker.trackChatbotMessage(userMessage, true);

        try {
            // Get AI response from Groq
            const response = await this.getGroqResponse(userMessage);

            this.conversationHistory.push({
                role: 'assistant',
                content: response.text,
                timestamp: new Date(),
                data: response.data
            });

            this.actionTracker.trackChatbotMessage(response.text, false);
            return response;

        } catch (error) {
            console.error('Groq API Error:', error);

            // Fallback to rule-based response
            const intent = this.analyzeIntent(userMessage);
            const fallbackResponse = this.generateResponse(userMessage, intent);

            this.conversationHistory.push({
                role: 'assistant',
                content: fallbackResponse.text,
                timestamp: new Date(),
                data: fallbackResponse.data
            });

            this.actionTracker.trackChatbotMessage(fallbackResponse.text, false);
            return fallbackResponse;
        }
    }

    // Get response from Groq API
    async getGroqResponse(userMessage) {
        // Build context about user behavior and products
        const userContext = this.buildUserContext();
        const productContext = this.buildProductContext();

        // Create system prompt with e-commerce context
        const systemPrompt = `You are an intelligent shopping assistant for SmartShop AI, an e-commerce platform. Your role is to help customers find products, answer questions, and guide purchases.

AVAILABLE PRODUCTS:
${productContext}

USER BEHAVIOR CONTEXT:
${userContext}

GUIDELINES:
- Be friendly, helpful, and concise
- Recommend products based on user interests and browsing history
- Suggest bundles when appropriate to save money
- Use emojis to make conversations engaging
- If asked about specific products, provide details from the product list
- Keep responses under 150 words unless detailed explanation needed
- When recommending products, mention their names and prices
- Encourage users to add items to cart or explore bundles

Respond naturally to the user's message.`;

        // Prepare messages for Groq API
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-6).map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Call Groq API
        const response = await fetch(this.groqApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Parse response and extract product recommendations if any
        const parsedResponse = this.parseAIResponse(aiResponse, userMessage);

        return parsedResponse;
    }

    // Build context about user's browsing behavior
    buildUserContext() {
        const mostViewed = this.actionTracker.getMostViewedProducts().slice(0, 3);
        const searches = this.actionTracker.getSearchHistory().slice(-3);
        const cartItems = this.actionTracker.getCartAdditions().slice(-3);

        let context = '';

        if (mostViewed.length > 0) {
            const productNames = mostViewed.map(mv => {
                const product = this.productManager.getProductById(mv.productId);
                return product ? product.name : 'Unknown';
            }).join(', ');
            context += `Most viewed products: ${productNames}\n`;
        }

        if (searches.length > 0) {
            context += `Recent searches: ${searches.join(', ')}\n`;
        }

        if (cartItems.length > 0) {
            const cartNames = cartItems.map(item => item.data.productName).join(', ');
            context += `Items in cart: ${cartNames}\n`;
        }

        if (!context) {
            context = 'User is browsing for the first time.\n';
        }

        return context;
    }

    // Build context about available products
    buildProductContext() {
        const products = this.productManager.getAllProducts();
        const categories = this.productManager.getCategories();

        let context = `Categories: ${categories.join(', ')}\n\n`;
        context += 'Product Catalog:\n';

        products.forEach(product => {
            context += `- ${product.name} (${product.category}): $${product.price.toFixed(2)} - ${product.description}\n`;
        });

        // Add bundle information
        const bundles = this.bundleEngine.getTopBundles(2);
        if (bundles.length > 0) {
            context += '\nCurrent Bundle Deals:\n';
            bundles.forEach(bundle => {
                context += `- ${bundle.name}: ${bundle.products.length} items, ${bundle.discountRate.toFixed(0)}% off, Save $${bundle.savings.toFixed(2)}\n`;
            });
        }

        return context;
    }

    // Parse AI response and extract product recommendations
    parseAIResponse(aiResponse, userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const lowerResponse = aiResponse.toLowerCase();

        // Check if AI mentioned specific products
        const products = this.productManager.getAllProducts();
        const recommendedProducts = [];

        products.forEach(product => {
            if (lowerResponse.includes(product.name.toLowerCase())) {
                recommendedProducts.push(product);
            }
        });

        // If products were mentioned or user asked for recommendations, include product data
        if (recommendedProducts.length > 0 ||
            /(recommend|suggest|show|looking for|need|want)/i.test(lowerMessage)) {

            // If no specific products mentioned but user wants recommendations
            if (recommendedProducts.length === 0) {
                // Use browsing history or category from message
                const categories = this.productManager.getCategories();
                const mentionedCategory = categories.find(cat =>
                    lowerMessage.includes(cat.toLowerCase())
                );

                if (mentionedCategory) {
                    recommendedProducts.push(...this.productManager.getProductsByCategory(mentionedCategory).slice(0, 3));
                } else {
                    // Use most viewed products
                    const mostViewed = this.actionTracker.getMostViewedProducts().slice(0, 3);
                    mostViewed.forEach(mv => {
                        const product = this.productManager.getProductById(mv.productId);
                        if (product) recommendedProducts.push(product);
                    });

                    // If still no products, show popular items
                    if (recommendedProducts.length === 0) {
                        recommendedProducts.push(...products.slice(0, 3));
                    }
                }
            }

            this.context.lastRecommendedProducts = recommendedProducts.slice(0, 3);

            return {
                text: aiResponse,
                data: {
                    type: 'product_list',
                    products: recommendedProducts.slice(0, 3)
                }
            };
        }

        return {
            text: aiResponse,
            data: null
        };
    }

    // Analyze user intent from message
    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();

        // Greeting
        if (/(hi|hello|hey|good morning|good afternoon)/i.test(lowerMessage)) {
            return 'greeting';
        }

        // Product search/recommendation
        if (/(recommend|suggest|looking for|need|want|find|show me)/i.test(lowerMessage)) {
            return 'recommendation';
        }

        // Product details/questions
        if (/(tell me about|what is|how much|price|cost|details|info)/i.test(lowerMessage)) {
            return 'product_inquiry';
        }

        // Cart/checkout help
        if (/(cart|checkout|buy|purchase|order)/i.test(lowerMessage)) {
            return 'cart_help';
        }

        // Bundle/deal questions
        if (/(bundle|deal|discount|save|offer)/i.test(lowerMessage)) {
            return 'bundle_inquiry';
        }

        // Comparison
        if (/(compare|difference|better|vs|versus)/i.test(lowerMessage)) {
            return 'comparison';
        }

        // Help/support
        if (/(help|support|how to|can you)/i.test(lowerMessage)) {
            return 'help';
        }

        return 'general';
    }

    // Generate contextual response
    generateResponse(message, intent) {
        switch (intent) {
            case 'greeting':
                return this.handleGreeting();

            case 'recommendation':
                return this.handleRecommendation(message);

            case 'product_inquiry':
                return this.handleProductInquiry(message);

            case 'cart_help':
                return this.handleCartHelp();

            case 'bundle_inquiry':
                return this.handleBundleInquiry();

            case 'comparison':
                return this.handleComparison(message);

            case 'help':
                return this.handleHelp();

            default:
                return this.handleGeneral(message);
        }
    }

    handleGreeting() {
        const greetings = [
            "Hello! 👋 I'm your shopping assistant. How can I help you find the perfect products today?",
            "Hi there! 😊 I'm here to help you discover amazing products. What are you looking for?",
            "Hey! Welcome! I can help you find products, suggest bundles, or answer any questions. What interests you?"
        ];

        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        // Personalize based on browsing history
        const viewedProducts = this.actionTracker.getMostViewedProducts();
        if (viewedProducts.length > 0) {
            return {
                text: greeting + " I noticed you've been browsing. Would you like personalized recommendations?",
                data: null
            };
        }

        return { text: greeting, data: null };
    }

    handleRecommendation(message) {
        const lowerMessage = message.toLowerCase();
        let recommendations = [];

        // Extract category or product type from message
        const categories = this.productManager.getCategories();
        const matchedCategory = categories.find(cat =>
            lowerMessage.includes(cat.toLowerCase())
        );

        if (matchedCategory) {
            recommendations = this.productManager.getProductsByCategory(matchedCategory).slice(0, 3);
            this.context.lastRecommendedProducts = recommendations;

            return {
                text: `Great choice! Here are some excellent ${matchedCategory} products I recommend:`,
                data: {
                    type: 'product_list',
                    products: recommendations
                }
            };
        }

        // Check for specific keywords
        if (/(smart|home|automation)/i.test(lowerMessage)) {
            recommendations = this.productManager.products
                .filter(p => p.tags.includes('smart-home') || p.tags.includes('iot'))
                .slice(0, 3);
        } else if (/(fitness|exercise|workout)/i.test(lowerMessage)) {
            recommendations = this.productManager.getProductsByCategory('Fitness').slice(0, 3);
        } else if (/(tech|electronic|gadget)/i.test(lowerMessage)) {
            recommendations = this.productManager.getProductsByCategory('Electronics').slice(0, 3);
        } else {
            // Use browsing history for personalized recommendations
            const viewedProducts = this.actionTracker.getMostViewedProducts();
            if (viewedProducts.length > 0) {
                const topViewedId = viewedProducts[0].productId;
                recommendations = this.productManager.getRelatedProducts(topViewedId, 3);
            } else {
                // Default to popular products
                recommendations = this.productManager.products.slice(0, 3);
            }
        }

        this.context.lastRecommendedProducts = recommendations;

        return {
            text: "Based on your interests, I think you'll love these products:",
            data: {
                type: 'product_list',
                products: recommendations
            }
        };
    }

    handleProductInquiry(message) {
        const lowerMessage = message.toLowerCase();

        // Try to find product mentioned in message
        const products = this.productManager.getAllProducts();
        const mentionedProduct = products.find(p =>
            lowerMessage.includes(p.name.toLowerCase()) ||
            p.name.toLowerCase().includes(lowerMessage.split(' ').find(word => word.length > 4) || '')
        );

        if (mentionedProduct) {
            return {
                text: `Let me tell you about the ${mentionedProduct.name}!\n\n${mentionedProduct.description}\n\nPrice: $${mentionedProduct.price.toFixed(2)}\n\nWould you like to add it to your cart or see similar products?`,
                data: {
                    type: 'product_detail',
                    product: mentionedProduct
                }
            };
        }

        // If no specific product, use last recommended
        if (this.context.lastRecommendedProducts.length > 0) {
            const product = this.context.lastRecommendedProducts[0];
            return {
                text: `The ${product.name} is one of our best sellers! ${product.description} It's priced at $${product.price.toFixed(2)}. Interested?`,
                data: {
                    type: 'product_detail',
                    product: product
                }
            };
        }

        return {
            text: "I'd be happy to help you learn about our products! Could you tell me which product you're interested in, or what category you'd like to explore?",
            data: null
        };
    }

    handleCartHelp() {
        const cartAdditions = this.actionTracker.getCartAdditions();

        if (cartAdditions.length === 0) {
            return {
                text: "Your cart is currently empty. Would you like me to recommend some products to get you started? 🛒",
                data: null
            };
        }

        return {
            text: `You have ${cartAdditions.length} item(s) in your cart! Would you like to:\n\n• See bundle deals to save money\n• Get recommendations for complementary products\n• Proceed to checkout\n\nWhat would you prefer?`,
            data: {
                type: 'cart_summary',
                itemCount: cartAdditions.length
            }
        };
    }

    handleBundleInquiry() {
        const bundles = this.bundleEngine.getTopBundles(2);

        if (bundles.length === 0) {
            return {
                text: "Let me create some personalized bundles for you! Browse a few products first, and I'll suggest great combinations with discounts. 🎁",
                data: null
            };
        }

        const topBundle = bundles[0];
        return {
            text: `Great question! I have an amazing bundle for you: "${topBundle.name}" 🎉\n\n${topBundle.description}\n\nYou'll save ${topBundle.discountRate.toFixed(0)}% (${topBundle.savings.toFixed(2)})!\n\nWould you like to see the details?`,
            data: {
                type: 'bundle_offer',
                bundle: topBundle
            }
        };
    }

    handleComparison(message) {
        return {
            text: "I can help you compare products! Could you tell me which specific products you'd like to compare? For example, you could ask 'Compare the Smart Watch and Wireless Headphones'.",
            data: null
        };
    }

    handleHelp() {
        return {
            text: `I'm here to help! Here's what I can do for you:\n\n✨ **Product Recommendations** - Tell me what you're looking for\n🔍 **Product Information** - Ask about any product\n🎁 **Bundle Deals** - Find the best savings\n🛒 **Cart Assistance** - Help with your shopping cart\n💬 **General Questions** - Anything else you need!\n\nWhat would you like help with?`,
            data: null
        };
    }

    handleGeneral(message) {
        const responses = [
            "That's interesting! Is there a specific product or category you'd like to explore?",
            "I'm here to help you find the perfect products. What are you shopping for today?",
            "Let me know if you'd like product recommendations or have any questions about our items!"
        ];

        return {
            text: responses[Math.floor(Math.random() * responses.length)],
            data: null
        };
    }

    // Get conversation summary
    getConversationSummary() {
        return {
            messageCount: this.conversationHistory.length,
            userMessages: this.conversationHistory.filter(m => m.role === 'user').length,
            assistantMessages: this.conversationHistory.filter(m => m.role === 'assistant').length,
            currentIntent: this.context.userIntent,
            recommendedProducts: this.context.lastRecommendedProducts.length
        };
    }

    // Clear conversation
    clearConversation() {
        this.conversationHistory = [];
        this.context = {
            lastRecommendedProducts: [],
            userIntent: null,
            currentTopic: null
        };
    }
}

// Export for use in other modules
window.AIChatbot = AIChatbot;
