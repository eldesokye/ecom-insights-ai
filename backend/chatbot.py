"""
AI Chatbot with Groq Integration
Handles natural language conversations and product recommendations
"""

import os
from datetime import datetime
from groq import Groq
from typing import Dict, List, Optional
## import variales from .env
from dotenv import load_dotenv
load_dotenv()

Groq_api_key = os.getenv("GROQ_API_KEY")

class AIChatbot:
    def __init__(self, product_manager, bundle_engine):
        self.product_manager = product_manager
        self.bundle_engine = bundle_engine
        
        # Groq API Configuration
        self.groq_api_key = Groq_api_key
        self.client = Groq(api_key=self.groq_api_key)
        self.model = 'llama-3.3-70b-versatile'
        
        # Conversation storage (in production, use database)
        self.conversations = {}
    
    def process_message(self, message: str, user_context: Dict) -> Dict:
        """
        Process user message and return AI response
        
        Args:
            message: User's message
            user_context: Dictionary with user behavior data
                - viewed_products: List of product IDs
                - searches: List of search queries
                - cart_items: List of cart items
        
        Returns:
            Dictionary with response text and optional product recommendations
        """
        try:
            # Build context for AI
            system_prompt = self._build_system_prompt(user_context)
            
            # Get AI response from Groq
            response = self._get_groq_response(message, system_prompt)
            
            # Parse response and extract product recommendations
            parsed_response = self._parse_response(response, message, user_context)
            
            return {
                'text': parsed_response['text'],
                'products': parsed_response.get('products', []),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Chatbot error: {e}")
            # Fallback to rule-based response
            return self._fallback_response(message, user_context)
    
    def _build_system_prompt(self, user_context: Dict) -> str:
        """Build system prompt with product catalog and user context"""
        
        # Get product catalog
        products = self.product_manager.get_all_products()
        categories = self.product_manager.get_categories()
        
        # Build product context
        product_context = f"Categories: {', '.join(categories)}\n\nProduct Catalog:\n"
        for product in products:
            product_context += f"- {product['name']} ({product['category']}): ${product['price']:.2f} - {product['description']}\n"
        
        # Build user behavior context
        user_behavior = self._build_user_context(user_context)
        
        # Get current bundles
        bundle_context = ""
        try:
            bundles = self.bundle_engine.get_top_bundles(
                user_context.get('user_actions', []), 
                limit=2
            )
            if bundles:
                bundle_context = "\n\nCurrent Bundle Deals:\n"
                for bundle in bundles:
                    bundle_context += f"- {bundle['name']}: {len(bundle['products'])} items, {bundle['discount_rate']:.0f}% off, Save ${bundle['savings']:.2f}\n"
        except:
            pass
        
        system_prompt = f"""You are an intelligent shopping assistant for SmartShop AI, an e-commerce platform. Your role is to help customers find products, answer questions, and guide purchases.

AVAILABLE PRODUCTS:
{product_context}

USER BEHAVIOR CONTEXT:
{user_behavior}
{bundle_context}

GUIDELINES:
- Be friendly, helpful, and concise
- Recommend products based on user interests and browsing history
- Suggest bundles when appropriate to save money
- Use emojis to make conversations engaging
- If asked about specific products, provide details from the product list
- Keep responses under 150 words unless detailed explanation needed
- When recommending products, mention their names and prices
- Encourage users to add items to cart or explore bundles

Respond naturally to the user's message."""
        
        return system_prompt
    
    def _build_user_context(self, user_context: Dict) -> str:
        """Build user behavior context string"""
        context_parts = []
        
        # Viewed products
        viewed_ids = user_context.get('viewed_products', [])
        if viewed_ids:
            viewed_names = [
                self.product_manager.get_product_by_id(pid)['name'] 
                for pid in viewed_ids[-3:] 
                if self.product_manager.get_product_by_id(pid)
            ]
            if viewed_names:
                context_parts.append(f"Most viewed products: {', '.join(viewed_names)}")
        
        # Searches
        searches = user_context.get('searches', [])
        if searches:
            context_parts.append(f"Recent searches: {', '.join(searches[-3:])}")
        
        # Cart items
        cart_items = user_context.get('cart_items', [])
        if cart_items:
            cart_names = [item.get('name', '') for item in cart_items]
            context_parts.append(f"Items in cart: {', '.join(cart_names)}")
        
        if not context_parts:
            return "User is browsing for the first time."
        
        return "\n".join(context_parts)
    
    def _get_groq_response(self, message: str, system_prompt: str) -> str:
        """Get response from Groq API"""
        
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            model=self.model,
            temperature=0.7,
            max_tokens=500,
            top_p=0.9
        )
        
        return chat_completion.choices[0].message.content
    
    def _parse_response(self, ai_response: str, message: str, user_context: Dict) -> Dict:
        """Parse AI response and extract product recommendations"""
        
        result = {
            'text': ai_response,
            'products': []
        }
        
        # Check if user is asking for recommendations
        recommendation_keywords = ['recommend', 'suggest', 'show', 'looking for', 'need', 'want']
        is_asking_for_products = any(keyword in message.lower() for keyword in recommendation_keywords)
        
        # Find products mentioned in AI response
        products = self.product_manager.get_all_products()
        mentioned_products = []
        
        for product in products:
            if product['name'].lower() in ai_response.lower():
                mentioned_products.append(product)
        
        # If products mentioned or user asked for recommendations
        if mentioned_products or is_asking_for_products:
            if mentioned_products:
                result['products'] = mentioned_products[:3]
            else:
                # Provide recommendations based on context
                result['products'] = self._get_contextual_recommendations(message, user_context)
        
        return result
    
    def _get_contextual_recommendations(self, message: str, user_context: Dict) -> List[Dict]:
        """Get product recommendations based on context"""
        
        # Check for category mentions
        categories = self.product_manager.get_categories()
        for category in categories:
            if category.lower() in message.lower():
                return self.product_manager.get_products_by_category(category)[:3]
        
        # Use viewed products
        viewed_ids = user_context.get('viewed_products', [])
        if viewed_ids:
            last_viewed = viewed_ids[-1]
            related = self.product_manager.get_related_products(last_viewed, limit=3)
            if related:
                return related
        
        # Default to popular products
        return self.product_manager.get_all_products()[:3]
    
    def _fallback_response(self, message: str, user_context: Dict) -> Dict:
        """Fallback response when Groq API fails"""
        
        message_lower = message.lower()
        
        # Simple rule-based responses
        if any(word in message_lower for word in ['hi', 'hello', 'hey']):
            text = "Hello! 👋 I'm your shopping assistant. How can I help you find the perfect products today?"
        elif any(word in message_lower for word in ['recommend', 'suggest', 'show']):
            text = "I'd be happy to recommend some products! What are you interested in?"
            products = self._get_contextual_recommendations(message, user_context)
            return {
                'text': text,
                'products': products,
                'timestamp': datetime.now().isoformat()
            }
        elif 'bundle' in message_lower or 'deal' in message_lower:
            text = "We have great bundle deals available! Browse products to see personalized bundles with discounts up to 20% off! 🎁"
        else:
            text = "I'm here to help you find products! What are you looking for today?"
        
        return {
            'text': text,
            'products': [],
            'timestamp': datetime.now().isoformat()
        }
    
    def get_conversation_history(self, session_id: str) -> List[Dict]:
        """Get conversation history for a session"""
        return self.conversations.get(session_id, [])
