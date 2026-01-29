"""
Dynamic Bundle Generation Engine
AI-powered product bundling with multiple strategies
"""

from typing import List, Dict
from collections import Counter

class BundleEngine:
    def __init__(self, product_manager):
        self.product_manager = product_manager
        self.bundle_id_counter = 1
    
    def generate_personalized_bundles(self, user_actions: List[Dict], cart_items: List[int]) -> List[Dict]:
        """
        Generate personalized product bundles based on user behavior
        
        Args:
            user_actions: List of user action dictionaries
            cart_items: List of product IDs in cart
        
        Returns:
            List of bundle dictionaries
        """
        bundles = []
        
        # Strategy 1: Frequently Viewed Together
        viewed_bundle = self._create_frequently_viewed_bundle(user_actions)
        if viewed_bundle:
            bundles.append(viewed_bundle)
        
        # Strategy 2: Category-Based Complementary Products
        category_bundle = self._create_category_bundle(user_actions)
        if category_bundle:
            bundles.append(category_bundle)
        
        # Strategy 3: Cart Completion Bundle
        if cart_items:
            cart_bundle = self._create_cart_completion_bundle(cart_items)
            if cart_bundle:
                bundles.append(cart_bundle)
        
        # Strategy 4: Search Intent Bundle
        search_bundle = self._create_search_intent_bundle(user_actions)
        if search_bundle:
            bundles.append(search_bundle)
        
        # Strategy 5: Smart Ecosystem Bundle
        ecosystem_bundle = self._create_ecosystem_bundle(user_actions)
        if ecosystem_bundle:
            bundles.append(ecosystem_bundle)
        
        return bundles
    
    def _create_frequently_viewed_bundle(self, user_actions: List[Dict]) -> Dict:
        """Create bundle from frequently viewed products"""
        
        # Extract viewed product IDs
        viewed_ids = [
            action['product_id'] 
            for action in user_actions 
            if action.get('type') == 'product_view' and 'product_id' in action
        ]
        
        if len(viewed_ids) < 2:
            return None
        
        # Get most recent unique views
        unique_views = list(dict.fromkeys(viewed_ids))[-4:]
        products = [
            self.product_manager.get_product_by_id(pid) 
            for pid in unique_views
        ]
        products = [p for p in products if p]  # Filter None
        
        if len(products) < 2:
            return None
        
        return self._create_bundle(
            name='Frequently Viewed Together',
            products=products,
            description='Based on your browsing history',
            discount_rate=0.15,
            icon='🔥'
        )
    
    def _create_category_bundle(self, user_actions: List[Dict]) -> Dict:
        """Create bundle from most viewed category"""
        
        # Extract viewed product IDs
        viewed_ids = [
            action['product_id'] 
            for action in user_actions 
            if action.get('type') == 'product_view' and 'product_id' in action
        ]
        
        if not viewed_ids:
            return None
        
        # Find most viewed category
        categories = []
        for pid in viewed_ids:
            product = self.product_manager.get_product_by_id(pid)
            if product:
                categories.append(product['category'])
        
        if not categories:
            return None
        
        # Get most common category
        category_counts = Counter(categories)
        top_category = category_counts.most_common(1)[0][0]
        
        # Get products from that category
        category_products = self.product_manager.get_products_by_category(top_category)[:3]
        
        if len(category_products) < 2:
            return None
        
        return self._create_bundle(
            name=f'{top_category} Essentials',
            products=category_products,
            description=f'Complete your {top_category.lower()} collection',
            discount_rate=0.12,
            icon='⭐'
        )
    
    def _create_cart_completion_bundle(self, cart_items: List[int]) -> Dict:
        """Create bundle to complete cart items"""
        
        if not cart_items:
            return None
        
        # Find complementary products
        complementary_products = []
        
        for item_id in cart_items:
            related = self.product_manager.get_related_products(item_id, limit=2)
            for product in related:
                # Don't include products already in cart
                if product['id'] not in cart_items:
                    # Avoid duplicates
                    if not any(p['id'] == product['id'] for p in complementary_products):
                        complementary_products.append(product)
        
        if not complementary_products:
            return None
        
        bundle_products = complementary_products[:3]
        
        return self._create_bundle(
            name='Complete Your Order',
            products=bundle_products,
            description='Customers who bought these also added',
            discount_rate=0.10,
            icon='🎁'
        )
    
    def _create_search_intent_bundle(self, user_actions: List[Dict]) -> Dict:
        """Create bundle based on search queries"""
        
        # Extract search queries
        searches = [
            action['query'] 
            for action in user_actions 
            if action.get('type') == 'search' and 'query' in action
        ]
        
        if not searches:
            return None
        
        # Use most recent search
        last_search = searches[-1]
        search_results = self.product_manager.search_products(last_search)
        
        if len(search_results) < 2:
            return None
        
        return self._create_bundle(
            name='Based on Your Search',
            products=search_results[:3],
            description=f'Perfect matches for "{last_search}"',
            discount_rate=0.08,
            icon='🔍'
        )
    
    def _create_ecosystem_bundle(self, user_actions: List[Dict]) -> Dict:
        """Create themed ecosystem bundle (smart home, fitness, etc.)"""
        
        # Extract viewed product IDs
        viewed_ids = [
            action['product_id'] 
            for action in user_actions 
            if action.get('type') == 'product_view' and 'product_id' in action
        ]
        
        if not viewed_ids:
            return None
        
        viewed_products = [
            self.product_manager.get_product_by_id(pid) 
            for pid in viewed_ids
        ]
        viewed_products = [p for p in viewed_products if p]
        
        # Check for smart home interest
        smart_home_products = [
            p for p in viewed_products 
            if 'smart-home' in p.get('tags', []) or 'iot' in p.get('tags', [])
        ]
        
        if smart_home_products:
            all_smart_home = [
                p for p in self.product_manager.get_all_products()
                if 'smart-home' in p.get('tags', []) or 'iot' in p.get('tags', [])
            ][:3]
            
            if len(all_smart_home) >= 2:
                return self._create_bundle(
                    name='Smart Home Starter Kit',
                    products=all_smart_home,
                    description='Build your connected home',
                    discount_rate=0.20,
                    icon='🏠'
                )
        
        # Check for fitness interest
        fitness_products = [
            p for p in viewed_products 
            if p.get('category') == 'Fitness'
        ]
        
        if fitness_products:
            all_fitness = self.product_manager.get_products_by_category('Fitness')[:3]
            
            if len(all_fitness) >= 2:
                return self._create_bundle(
                    name='Fitness Starter Pack',
                    products=all_fitness,
                    description='Everything you need to start your fitness journey',
                    discount_rate=0.18,
                    icon='💪'
                )
        
        return None
    
    def _create_bundle(self, name: str, products: List[Dict], description: str, 
                      discount_rate: float, icon: str = '📦') -> Dict:
        """Create bundle object with pricing"""
        
        total_price = sum(p['price'] for p in products)
        discount_amount = total_price * discount_rate
        final_price = total_price - discount_amount
        
        bundle = {
            'id': f'bundle_{self.bundle_id_counter}',
            'name': name,
            'description': description,
            'icon': icon,
            'products': products,
            'original_price': round(total_price, 2),
            'discount_rate': round(discount_rate * 100, 2),  # Convert to percentage
            'discount_amount': round(discount_amount, 2),
            'final_price': round(final_price, 2),
            'savings': round(discount_amount, 2)
        }
        
        self.bundle_id_counter += 1
        return bundle
    
    def get_top_bundles(self, user_actions: List[Dict], limit: int = 3) -> List[Dict]:
        """Get top-ranked bundles based on user behavior"""
        
        # Generate all bundles
        bundles = self.generate_personalized_bundles(user_actions, [])
        
        # Score bundles
        scored_bundles = []
        for bundle in bundles:
            score = self._calculate_bundle_score(bundle, user_actions)
            scored_bundles.append({
                **bundle,
                'score': score
            })
        
        # Sort by score and return top N
        scored_bundles.sort(key=lambda x: x['score'], reverse=True)
        return scored_bundles[:limit]
    
    def _calculate_bundle_score(self, bundle: Dict, user_actions: List[Dict]) -> float:
        """Calculate relevance score for bundle"""
        
        score = 0.0
        
        # Extract viewed product IDs
        viewed_ids = [
            action['product_id'] 
            for action in user_actions 
            if action.get('type') == 'product_view' and 'product_id' in action
        ]
        
        # Higher score for products user has viewed
        for product in bundle['products']:
            if product['id'] in viewed_ids:
                score += 10
        
        # Higher score for larger discounts
        score += bundle['discount_rate']
        
        # Higher score for more products
        score += len(bundle['products']) * 2
        
        return score
    
    def get_bundle_analytics(self, user_actions: List[Dict]) -> Dict:
        """Get bundle performance analytics"""
        
        bundle_views = sum(1 for a in user_actions if a.get('type') == 'bundle_view')
        bundle_accepts = sum(1 for a in user_actions if a.get('type') == 'bundle_accept')
        bundle_rejects = sum(1 for a in user_actions if a.get('type') == 'bundle_reject')
        
        conversion_rate = 0
        if bundle_views > 0:
            conversion_rate = (bundle_accepts / bundle_views) * 100
        
        return {
            'bundle_views': bundle_views,
            'bundle_accepts': bundle_accepts,
            'bundle_rejects': bundle_rejects,
            'conversion_rate': round(conversion_rate, 2)
        }
