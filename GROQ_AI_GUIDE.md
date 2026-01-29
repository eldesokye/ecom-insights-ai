# Groq AI Integration - Quick Start Guide

## 🚀 What Changed?

Your chatbot is now powered by **Groq's ultra-fast LLM API** using the **llama-3.3-70b-versatile** model!

### Key Improvements:

✅ **Real AI Conversations** - Natural language understanding with context awareness  
✅ **Product Knowledge** - AI knows all 18 products in your catalog  
✅ **User Behavior Awareness** - Recommendations based on browsing history  
✅ **Bundle Intelligence** - Suggests current deals automatically  
✅ **Ultra-Fast Responses** - Groq's inference is incredibly fast  
✅ **Fallback System** - If API fails, uses rule-based responses  

---

## 🧪 Testing the AI Chatbot

### 1. Open the Application
```
Open: d:\deciosn ai system\index.html
```

### 2. Start Chatting
Click the **"Chat with AI"** button (bottom right)

### 3. Try These Prompts:

**General Greeting:**
```
"Hi! What can you help me with?"
```

**Product Recommendations:**
```
"I'm looking for electronics under $200"
"Show me fitness products"
"What smart home devices do you have?"
```

**Specific Product Questions:**
```
"Tell me about the wireless headphones"
"How much is the robot vacuum?"
"Compare the smart watch and fitness tracker"
```

**Bundle Deals:**
```
"Do you have any bundle deals?"
"What's the best way to save money?"
"Show me package deals"
```

**Personalized Recommendations:**
```
(First browse some products, then ask)
"Based on what I've been looking at, what do you recommend?"
```

---

## 🔧 How It Works

### System Prompt
The AI receives context about:
- **All 18 products** with names, prices, descriptions
- **User's browsing history** (most viewed products)
- **Search queries** performed
- **Cart contents**
- **Available bundle deals**

### Example Context Sent to AI:
```
AVAILABLE PRODUCTS:
- Wireless Headphones Pro (Electronics): $199.99 - Premium noise-canceling...
- Smart Watch Ultra (Electronics): $399.99 - Advanced fitness tracking...
[... all products ...]

USER BEHAVIOR CONTEXT:
Most viewed products: Wireless Headphones Pro, Smart Watch Ultra
Recent searches: wireless
Items in cart: Yoga Mat Premium

CURRENT BUNDLE DEALS:
- Electronics Essentials: 3 items, 12% off, Save $71.99
```

### AI Response Processing
1. **Groq API Call** - Sends user message + context
2. **Response Parsing** - Extracts product mentions
3. **Product Cards** - Displays recommended items with "Add to Cart" buttons
4. **Fallback** - If API fails, uses rule-based responses

---

## 🎯 Smart Features

### Context-Aware Recommendations
The AI considers:
- Products you've viewed
- Your search history
- Items in your cart
- Current bundle deals

### Product Card Display
When AI recommends products, they appear as interactive cards with:
- Product emoji icon
- Name and price
- Quick "Add to Cart" button

### Natural Conversation
The AI can:
- Answer follow-up questions
- Remember conversation context (last 6 messages)
- Provide detailed product information
- Suggest alternatives
- Explain bundle savings

---

## 🔐 API Configuration

**Location:** `d:\deciosn ai system\js\aiChatbot.js`

```javascript
// Groq API Configuration
this.groqApiKey = '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';
this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
this.model = 'llama-3.3-70b-versatile';
```

**API Parameters:**
- `temperature: 0.7` - Balanced creativity
- `max_tokens: 500` - Concise responses
- `top_p: 0.9` - High quality outputs

---

## 🐛 Troubleshooting

### If Chatbot Doesn't Respond:

1. **Check Browser Console** (F12)
   - Look for errors
   - Check network tab for API calls

2. **Verify API Key**
   - Make sure key is valid
   - Check Groq dashboard for usage limits

3. **Test Fallback**
   - Disconnect internet temporarily
   - Chatbot should still work with rule-based responses

### Common Issues:

**CORS Error:**
- Groq API should support CORS from browser
- If issues persist, consider using a proxy

**Rate Limiting:**
- Groq has generous free tier
- Check your API usage at groq.com

**Network Error:**
- Fallback system activates automatically
- Check internet connection

---

## 📊 Monitoring

### View API Calls in Console:
```javascript
// Check conversation history
app.chatbot.conversationHistory

// See last AI response
app.chatbot.conversationHistory[app.chatbot.conversationHistory.length - 1]
```

### Track Performance:
- Groq responses are typically < 1 second
- Watch Network tab in DevTools for timing

---

## 🎨 Customization

### Change AI Personality:
Edit the system prompt in `aiChatbot.js`:
```javascript
const systemPrompt = `You are a [YOUR PERSONALITY] shopping assistant...`
```

### Adjust Response Length:
```javascript
max_tokens: 500  // Increase for longer responses
```

### Change Temperature:
```javascript
temperature: 0.7  // 0.0 = focused, 1.0 = creative
```

---

## 🚀 Next Steps

### Enhance Further:
1. **Add Product Images** - Include real product photos
2. **Voice Input** - Use Web Speech API
3. **Multi-language** - Translate conversations
4. **Sentiment Analysis** - Detect user mood
5. **Purchase History** - Remember past orders

### Production Deployment:
- Move API key to environment variables
- Add backend proxy for security
- Implement rate limiting
- Add error logging
- Monitor API costs

---

## ✅ Verification Checklist

- [ ] Open index.html in browser
- [ ] Click "Chat with AI" button
- [ ] Send greeting message
- [ ] Ask for product recommendations
- [ ] Verify product cards appear
- [ ] Click "Add to Cart" in chat
- [ ] Ask about bundle deals
- [ ] Test conversation memory (ask follow-up)
- [ ] Check browser console for errors

---

## 🎉 Success!

Your chatbot is now powered by cutting-edge AI technology! The combination of:
- **Groq's ultra-fast inference**
- **Llama 3.3 70B model**
- **Product catalog context**
- **User behavior tracking**

Creates an incredibly smart shopping assistant that feels truly intelligent! 🤖✨

---

**Need Help?** Check browser console for detailed logs and error messages.
