# SmartShop AI - E-Commerce System with AI

An intelligent e-commerce platform that tracks user behavior, generates personalized product bundles using AI, and provides a smart chatbot assistant to guide customers toward purchases.

## 🌟 Features

### 1. **User Action Tracking**
- Tracks all user interactions in real-time
- Monitors product views, searches, cart actions, and clicks
- Stores browsing history and preferences
- Privacy-compliant data collection
- Analytics dashboard capabilities

### 2. **AI-Powered Dynamic Bundles**
The system uses 5 intelligent strategies to create personalized bundles:

- **Frequently Viewed Together**: Bundles based on browsing history
- **Category-Based**: Complete collections from favorite categories
- **Cart Completion**: Complementary products for items in cart
- **Search Intent**: Products matching search queries
- **Ecosystem Bundles**: Smart home kits, fitness packs, etc.

Each bundle includes:
- Automatic discount calculation (8-20% off)
- Real-time price optimization
- Personalized recommendations
- Savings display

### 3. **Smart AI Chatbot** ⚡ POWERED BY GROQ AI
Conversational assistant with **real AI intelligence** using Groq's ultra-fast LLM API:

**AI Capabilities:**
- Natural language understanding with llama-3.3-70b-versatile model
- Context-aware responses based on conversation history
- Product catalog knowledge (all 18 products)
- User behavior awareness (browsing history, searches, cart)
- Bundle deal suggestions
- Ultra-fast response times (< 1 second)

**Features:**
- Answer product questions naturally
- Personalized recommendations based on browsing
- Explain bundle benefits and savings
- Handle complex queries and comparisons
- Guide through checkout process
- Fallback to rule-based responses if API unavailable

> **Note:** Uses Groq API for real AI responses. See [GROQ_AI_GUIDE.md](GROQ_AI_GUIDE.md) for details.

### 4. **Premium UI/UX**
- Modern dark theme with glassmorphism
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Gradient accents and vibrant colors
- Intuitive navigation

## 🚀 Getting Started

### Installation

1. **Clone or download the project**
   ```bash
   cd "d:\deciosn ai system"
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - No build process or dependencies required!

### Usage

1. **Browse Products**
   - Scroll through the product catalog
   - Use category filters to narrow down options
   - Search for specific items

2. **Get Personalized Bundles**
   - Browse products to build your profile
   - AI will automatically generate bundle recommendations
   - View savings and add bundles to cart

3. **Chat with AI Assistant**
   - Click the "Chat with AI" button
   - Ask questions about products
   - Get personalized recommendations
   - Request help with your order

4. **Shopping Cart**
   - Click the cart icon to view items
   - Adjust quantities or remove items
   - See total with tax and shipping
   - Free shipping over $100!

## 📁 Project Structure

```
d:\deciosn ai system\
├── index.html              # Main HTML file
├── styles.css              # Premium CSS styling
├── js/
│   ├── products.js         # Product database (18 items)
│   ├── actionTracker.js    # User behavior tracking
│   ├── bundleEngine.js     # AI bundle generation
│   ├── aiChatbot.js        # Intelligent chatbot
│   ├── cart.js             # Shopping cart logic
│   └── app.js              # Main application controller
└── README.md               # This file
```

## 🎯 How It Works

### Action Tracking
Every user interaction is captured:
```javascript
// Example tracked actions
- product_view: When user views a product
- search: When user searches
- add_to_cart: When item added to cart
- bundle_view: When bundle is viewed
- chatbot_message: Chat interactions
```

### Bundle Generation Algorithm
```javascript
// Scoring system
1. User browsing history analysis
2. Category affinity calculation
3. Product relationship mapping
4. Discount optimization
5. Real-time bundle updates
```

### AI Chatbot Intelligence
```javascript
// Intent recognition
- Greeting detection
- Product inquiry
- Recommendation requests
- Cart assistance
- Comparison requests
```

## 💾 Data Storage

All data is stored locally using `localStorage`:
- **userActions**: Complete action history
- **shoppingCart**: Cart items and quantities
- No server required for demo
- Data persists across sessions

## 🎨 Design Features

- **Color Scheme**: Dark theme with purple/pink gradients
- **Typography**: Inter font family
- **Effects**: Glassmorphism, shadows, gradients
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Works on all screen sizes

## 🔧 Customization

### Add More Products
Edit `js/products.js` and add items to the products array:
```javascript
{
    id: 19,
    name: "Your Product",
    category: "Category",
    price: 99.99,
    image: "🎁",
    description: "Product description",
    tags: ["tag1", "tag2"]
}
```

### Adjust Bundle Discounts
Modify discount rates in `js/bundleEngine.js`:
```javascript
// Change discount percentages
discountRate: 0.15  // 15% off
```

### Customize Chatbot Responses
Edit response templates in `js/aiChatbot.js`

## 📊 Analytics

View tracking data in browser console:
```javascript
// Get action summary
app.actionTracker.getSummary()

// View bundle analytics
app.bundleEngine.getBundleAnalytics()

// See chatbot stats
app.chatbot.getConversationSummary()
```

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🔐 Privacy

- All data stored locally
- No external API calls
- No user data transmitted
- Clear data anytime via browser settings

## 🚀 Future Enhancements

Potential additions:
- Backend integration with real AI (OpenAI, Anthropic)
- User authentication
- Order processing
- Payment integration
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- Advanced analytics dashboard

## 📝 License

Free to use and modify for your projects!

## 🤝 Support

For questions or issues, check the browser console for debugging information.

---

**Built with ❤️ using Vanilla JavaScript, HTML, and CSS**

*No frameworks, no dependencies, just pure web technology!*
